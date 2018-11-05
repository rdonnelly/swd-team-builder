#!/usr/bin/env node

import * as _ from 'lodash';
import checksum from 'json-checksum';
import jsonfile from 'jsonfile';
import path from 'path';

import sets from 'swdestinydb-json-data/sets.json';
import characters from '../data/characters.json';
import plots from '../data/plots.json';

const MIN_CHARACTER_COUNT = 1;
const MIN_DICE = 0;
const MIN_POINTS = 0;
const MAX_POINTS = 30;
const PAGE_SIZE = 5000;

let teams = [];
const teamsStats = {
  count: 0,
  minDice: 1000,
  maxDice: 0,
  minHealth: 1000,
  maxHealth: 0,
  minCharacterCount: 1000,
  maxCharacterCount: 0,
  minPoints: 1000,
  maxPoints: 0,
  numPages: 0,
};

const factionRank = {
  red: 0,
  blue: 1,
  yellow: 2,
};

class Team {
  constructor(plot = null) {
    this.key = null;

    this.characters = [];
    this.characterCount = 0;

    this.affiliations = [];
    this.damageTypes = [];
    this.diceCount = 0;
    this.factions = [];
    this.health = 0;
    this.points = 0;
    this.sets = [];

    this.ranks = {};

    if (plot) {
      this.plot = { ...plot };
    }
  }

  getKey() {
    return this.characters
      .map(character => `${character.id}_${character.diceCount}_${character.count}`)
      .sort()
      .join('__');
  }

  setCharacterCount() {
    this.characterCount = this.characters.reduce(
      (count, characterObject) => count + characterObject.count,
      0,
    );
  }

  hasCharacterId(cardId) {
    return this.characters
      .some(characterCard => characterCard.id === cardId);
  }

  hasCharacterName(cardName) {
    return this.characters
      .some(characterCard => characterCard.name === cardName);
  }

  getCharacterCount(cardId) {
    const characterObj = this.characters.find(characterCard => characterCard.id === cardId);
    return characterObj ? characterObj.count : 0;
  }

  addCharacter(card, isElite) {
    const characterObj = {
      id: card.id,
      name: card.name,
      faction: card.faction,
      count: 1,
      diceCount: isElite ? 2 : 1,
      pointsRegular: card.pointsRegular,
      pointsElite: card.pointsElite,
    };

    const existingCharacterObj = this.characters.find(
      character => character.id === card.id,
    );

    if (existingCharacterObj === undefined) {
      this.characters.push(characterObj);
    } else {
      existingCharacterObj.count += 1;
    }

    this.characters = this.characters.sort((a, b) => {
      if (b.faction !== a.faction) {
        return factionRank[b.faction] < factionRank[a.faction] ? 1 : -1;
      }

      if (b.isUnique !== a.isUnique) {
        return b.isUnique > a.isUnique ? 1 : -1;
      }

      if (b.name !== a.name) {
        return b.name < a.name ? 1 : -1;
      }

      return 0;
    });

    this.sets.push(card.set);
    this.sets = _.uniq(this.sets);

    this.affiliations = _.uniq([].concat(this.affiliations, [card.affiliation]));

    this.health += card.health;

    this.factions = _.uniq([].concat(this.factions, [card.faction]));

    this.damageTypes = _.uniq([].concat(this.damageTypes, card.damageTypes));

    if (isElite) {
      this.diceCount += 2;
      this.points += card.pointsElite;
    } else {
      this.diceCount += 1;
      this.points += card.pointsRegular;
    }

    this.key = this.getKey();
    this.setCharacterCount();

    if (this.plot && this.plot.id === '08155' && // PLOT: No Allegiance
        this.affiliations.length === 1 && this.affiliations.includes('neutral')) {
      this.health += 1;
    }

    if (card.id === '05038' && // CHARACTER: Clone Trooper
        this.hasCharacterId('08073')) { // CHARACTER: Clone Commander Cody
      this.points -= 1;
    }
    if (card.id === '08073') { // CHARACTER: Clone Commander Cody
      this.points -= this.getCharacterCount('05038'); // CHARACTER: Clone Trooper
    }
  }
}

const checkTeamIsComplete = (team, eligibleCharacterCount) => {
  const teamPlotPoints = team.plot ? team.plot.points : 0;
  const teamMaxPoints = MAX_POINTS - teamPlotPoints;

  if (eligibleCharacterCount >= MIN_CHARACTER_COUNT) {
    return false;
  }

  if (team.diceCount < MIN_DICE) {
    return false;
  }

  if (team.points < MIN_POINTS || team.points > teamMaxPoints) {
    return false;
  }


  if (team.plot) {
    if (team.plot.affiliation !== 'neutral' &&
        !team.affiliations.includes(team.plot.affiliation)) {
      return false;
    }

    if (team.plot.faction !== 'gray' &&
        !team.factions.includes(team.plot.faction)) {
      return false;
    }

    if (team.plot.id === '08115') { // Bitter Rivalry
      if (team.points < teamMaxPoints) {
        return false;
      }
    }
    if (team.plot.id === '08155') { // No Allegiance, all neutral characters
      if (team.affiliations.length !== 1 || !team.affiliations.includes('neutral')) {
        return false;
      }
    }
    if (team.plot.id === '08156') { // Solidarity, mono only
      if (team.points < teamMaxPoints) {
        return false;
      }
      if (team.factions.length !== 1) {
        return false;
      }
    }
  }

  // check if an elite character fits
  const canFitEliteVersionOfCharacter = team.characters.some((character) => {
    if (character.diceCount === 2 || !character.pointsElite) {
      return false;
    }

    return team.points - character.pointsRegular + character.pointsElite <= teamMaxPoints;
  });
  if (canFitEliteVersionOfCharacter) {
    return false;
  }

  return true;
};

const getEligibleCharacters = (potentialCharacters, team) => {
  const teamPlotPoints = team.plot ? team.plot.points : 0;
  const teamMaxPoints = MAX_POINTS - teamPlotPoints;
  const teamPointsRemaining = teamMaxPoints - team.points;
  return potentialCharacters
    .filter((character) => {
      let characterRegularPoints = character.pointsRegular;
      if (character.id === '05038' && // CHARACTER: Clone Trooper
          team.hasCharacterId('08073')) { // CHARACTER: Clone Commander Cody
        characterRegularPoints -= 1;
      }
      if (character.id === '08073' && // CHARACTER: Clone Commander Cody
          team.hasCharacterId('05038')) { // CHARACTER: Clone Trooper
        characterRegularPoints -= team.getCharacterCount('05038'); // CHARACTER: Clone Trooper
      }

      return characterRegularPoints <= teamPointsRemaining;
    })
    .filter(character => !character.isUnique || !team.hasCharacterName(character.name));
};

const build = (potentialCharacters, team) => {
  const eligibleCharacters = getEligibleCharacters(potentialCharacters, team);

  if (checkTeamIsComplete(team, eligibleCharacters.length)) {
    delete team.characters;
    delete team.plot;
    teams.push(team);
    return;
  }

  eligibleCharacters.forEach((character) => {
    const regularTeam = _.cloneDeep(team);
    regularTeam.addCharacter(character, false);
    build(eligibleCharacters, regularTeam);

    const teamPlotPoints = team.plot ? team.plot.points : 0;
    const teamMaxPoints = MAX_POINTS - teamPlotPoints;
    const teamPointsRemaining = teamMaxPoints - team.points;
    if (character.pointsElite && character.pointsElite <= teamPointsRemaining) {
      const eliteTeam = _.cloneDeep(team);
      eliteTeam.addCharacter(character, true);
      build(eligibleCharacters, eliteTeam);
    }
  });
};

const generateSetCombinations = (startSetCodes) => {
  const result = [];
  const fn = (arr, setCodes) => {
    for (let i = 0; i < setCodes.length; i += 1) {
      result.push(arr.concat([setCodes[i]]));
      fn(arr.concat([setCodes[i]]), setCodes.slice(i + 1));
    }
  };

  fn([], startSetCodes);

  return result;
};

const cleanUpTeams = (dirtyTeams) => {
  let cleanTeams = dirtyTeams;
  cleanTeams = cleanTeams.filter(team => team.characterCount > 0);
  cleanTeams = _.uniqBy(cleanTeams, team => team.key);
  return cleanTeams;
};

const sortTeams = (teamsToSort) => {
  _.sortBy(teamsToSort, ['diceCount', 'health', 'points', 'characterCount']).reverse().map((team, index) => {
    team.ranks.diceCount = index;
    return team;
  });

  _.sortBy(teamsToSort, ['health', 'diceCount', 'points', 'characterCount']).reverse().map((team, index) => {
    team.ranks.health = index;
    return team;
  });

  _.sortBy(teamsToSort, ['points', 'diceCount', 'health', 'characterCount']).reverse().map((team, index) => {
    team.ranks.points = index;
    return team;
  });

  _.sortBy(teamsToSort, ['characterCount', 'diceCount', 'health', 'points']).reverse().map((team, index) => {
    team.ranks.characterCount = index;
    return team;
  });

  teamsToSort.sort((teamA, teamB) => teamA.ranks.diceCount - teamB.ranks.diceCount);
};

const calculateStats = (statsTeams) => {
  statsTeams.forEach((team) => {
    if (team.diceCount < teamsStats.minDice) {
      teamsStats.minDice = team.diceCount;
    }
    if (team.diceCount > teamsStats.maxDice) {
      teamsStats.maxDice = team.diceCount;
    }

    if (team.health < teamsStats.minHealth) {
      teamsStats.minHealth = team.health;
    }
    if (team.health > teamsStats.maxHealth) {
      teamsStats.maxHealth = team.health;
    }

    if (team.characterCount < teamsStats.minCharacterCount) {
      teamsStats.minCharacterCount = team.characterCount;
    }
    if (team.characterCount > teamsStats.maxCharacterCount) {
      teamsStats.maxCharacterCount = team.characterCount;
    }

    if (team.points < teamsStats.minPoints) {
      teamsStats.minPoints = team.points;
    }
    if (team.points > teamsStats.maxPoints) {
      teamsStats.maxPoints = team.points;
    }
  });
};

const setCombinations =
  generateSetCombinations(_.map(sets, 'code'))
    .sort((a, b) => a.length - b.length);

const heroCharacters = Object.values(characters).filter(character => ['hero', 'neutral'].includes(character.affiliation));
const villainCharacters = Object.values(characters).filter(character => ['neutral', 'villain'].includes(character.affiliation));
const heroPlots = Object.values(plots).filter(plot => ['hero', 'neutral'].includes(plot.affiliation));
const villainPlots = Object.values(plots).filter(plot => ['neutral', 'villain'].includes(plot.affiliation));

setCombinations.forEach((setCombination, index) => {
  console.log('\x1b[34m%s\x1b[0m', `Generating teams for ${setCombination} (${index + 1}/${setCombinations.length})...`);

  const setHeroPlots = heroPlots.filter(plot => setCombination.includes(plot.set));
  setHeroPlots.forEach((plot) => {
    build(
      heroCharacters.filter(character => setCombination.includes(character.set)),
      new Team(plot),
    );

    teams = cleanUpTeams(teams);
  });

  const setVillainPlots = villainPlots.filter(plot => setCombination.includes(plot.set));
  setVillainPlots.forEach((plot) => {
    build(
      villainCharacters.filter(character => setCombination.includes(character.set)),
      new Team(plot),
    );

    teams = cleanUpTeams(teams);
  });

  build(
    heroCharacters.filter(character => setCombination.includes(character.set)),
    new Team(),
  );

  build(
    villainCharacters.filter(character => setCombination.includes(character.set)),
    new Team(),
  );

  teams = cleanUpTeams(teams);

  console.log('\x1b[34m%s\x1b[0m', `\tTeam Count: ${teams.length}`);
});


teams = sortTeams(teams);
calculateStats(teams);

const numPages = Math.ceil(teams.length / PAGE_SIZE);
teamsStats.count = teams.length || 0;
teamsStats.numPages = numPages;

console.log('\x1b[32m\x1b[1m%s\x1b[0m', `Generated ${teams.length} teams`); // eslint-disable-line no-console

for (let i = 0; i < numPages; i += 1) {
  const startIndex = i * PAGE_SIZE;
  const endIndex = ((i + 1) * PAGE_SIZE);
  const teamSlice = teams.slice(startIndex, endIndex);

  jsonfile.writeFile(path.join(__dirname, `../data/teams_${i}.json`), teamSlice);
  console.log('\x1b[32m\x1b[1m%s\x1b[0m', `Output ${teamSlice.length} teams in page ${i}`); // eslint-disable-line no-console
}

jsonfile.writeFile(path.join(__dirname, '../data/teams_stats.json'), teamsStats);
jsonfile.writeFile(path.join(__dirname, '../data/teams_checksum.json'), {
  checksum: checksum(teams),
  stats_checksum: checksum(teamsStats),
});
