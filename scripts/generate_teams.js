#!/usr/bin/env node

import * as _ from 'lodash';
import jsonfile from 'jsonfile';
import path from 'path';
import { characterCards, sets } from '../src/lib/Destiny';

const MIN_DICE = 0;
const MIN_POINTS = 0;
const MAX_POINTS = 30;

let teams = [];
const teamsStats = {
  minDice: 1000,
  maxDice: 0,
  minHealth: 1000,
  maxHealth: 0,
  minPoints: 1000,
  maxPoints: 0,
};

const factionRank = {
  red: 0,
  blue: 1,
  yellow: 2,
};

class Team {
  constructor() {
    this.key = '';
    this.characters = [];
    this.characterKeys = [];
    this.characterCount = 0;

    this.sets = [];

    this.affiliation = 'neutral';
    this.damageTypes = [];
    this.factions = [];
    this.health = 0;
    this.dice = 0;
    this.points = 0;
  }

  getKey() {
    return this.characters
      .map(character => `${character.id}_${character.numDice}_${character.count}`)
      .sort()
      .join('__');
  }

  setCharacterKeys() {
    this.characters.forEach(characterObject =>
      this.characterKeys.push(`${characterObject.id}_${characterObject.numDice}_${characterObject.count}`));
  }

  setCharacterCount() {
    this.characterCount = this.characters.reduce(
      (count, characterObject) => count + characterObject.count,
      0,
    );
  }

  hasCharacter(card) {
    return this.characters
      .some(characterCard => characterCard.name === card.name);
  }

  addCharacter(card, isElite) {
    const characterObj = {
      id: card.id,
      name: card.name,
      faction: card.faction,
      count: 1,
      numDice: isElite ? 2 : 1,
    };

    const existingCharacterObj = this.characters.find(character => character.id === card.id);

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

    if (['hero', 'villain'].indexOf(card.affiliation) !== -1) {
      this.affiliation = card.affiliation;
    }

    this.health += card.health;

    this.factions.push(card.faction);
    this.factions = _.uniq(this.factions);

    this.damageTypes = _.uniq([].concat(this.damageTypes, card.sides.reduce((acc, val) => {
      if (val.includes('ID')) {
        acc.push('ID');
      }

      if (val.includes('MD')) {
        acc.push('MD');
      }

      if (val.includes('RD')) {
        acc.push('RD');
      }

      return acc;
    }, [])));

    if (isElite) {
      this.dice += 2;
      this.points += card.pointsElite;
    } else {
      this.dice += 1;
      this.points += card.pointsRegular;
    }

    this.key = this.getKey();
  }
}

const getEligibleCharacters = (team, characters, pointsLeft) =>
  characters
    .filter(character => character.pointsRegular <= pointsLeft)
    .filter(character => !character.isUnique || !team.hasCharacter(character));

const checkTeam = (team, eligibleCharacters, pointsLeft) => {
  if (eligibleCharacters.length > 0 ||
      team.dice < MIN_DICE ||
      team.points < MIN_POINTS) {
    return false;
  }

  const eliteCheck = _.every(team.characters, (characterCard) => {
    const card = _.find(characterCards, { id: characterCard.id });

    if (characterCard.numDice === 1) {
      if (typeof card.pointsElite !== 'undefined') {
        const eliteDiff = card.pointsElite - card.pointsRegular;
        if (eliteDiff <= pointsLeft) {
          return false;
        }
      }
    }

    return true;
  });

  return eliteCheck;
};

const calculateStats = () => {
  teams.forEach((team) => {
    if (team.dice < teamsStats.minDice) {
      teamsStats.minDice = team.dice;
    }
    if (team.dice > teamsStats.maxDice) {
      teamsStats.maxDice = team.dice;
    }

    if (team.health < teamsStats.minHealth) {
      teamsStats.minHealth = team.health;
    }
    if (team.health > teamsStats.maxHealth) {
      teamsStats.maxHealth = team.health;
    }

    if (team.points < teamsStats.minPoints) {
      teamsStats.minPoints = team.points;
    }
    if (team.points > teamsStats.maxPoints) {
      teamsStats.maxPoints = team.points;
    }
  });
};

const buildTeams = (characters, pointsLeft, team) => {
  const eligibleCharacters = getEligibleCharacters(team, characters, pointsLeft);

  if (checkTeam(team, eligibleCharacters, pointsLeft)) {
    team.setCharacterCount();
    team.setCharacterKeys();
    delete team.characters;
    teams.push(team);
    return;
  }

  eligibleCharacters.forEach((character) => {
    const regularTeam = _.cloneDeep(team);
    regularTeam.addCharacter(character, false);
    buildTeams(eligibleCharacters, pointsLeft - character.pointsRegular, regularTeam);

    if (typeof character.pointsElite !== 'undefined' &&
        character.pointsElite <= pointsLeft) {
      const eliteTeam = _.cloneDeep(team);
      eliteTeam.addCharacter(character, true);
      buildTeams(eligibleCharacters, pointsLeft - character.pointsElite, eliteTeam);
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

const cleanUpTeams = () => {
  teams = _.filter(teams, team => team.characterCount > 0);

  teams = _.uniqBy(teams, team => JSON.stringify(team.key));

  teams = _.sortBy(teams, ['dice', 'health', 'points', 'characterCount']).map((team, index) => {
    team.rankDice = index;
    return team;
  });

  teams = _.sortBy(teams, ['health', 'dice', 'points', 'characterCount']).map((team, index) => {
    team.rankHealth = index;
    return team;
  });

  teams = _.sortBy(teams, ['points', 'dice', 'health', 'characterCount']).map((team, index) => {
    team.rankPoints = index;
    return team;
  });

  teams = _.sortBy(teams, ['characterCount', 'dice', 'health', 'points']).map((team, index) => {
    team.rankCharacterCount = index;
    return team;
  });

  teams = _.sortBy(teams, ['dice', 'health', 'points', 'characterCount']);
};

const setCombinations = generateSetCombinations(_.map(sets, 'code'));

const heroes = characterCards.filter(character => ['hero', 'neutral'].indexOf(character.affiliation) !== -1);
const villains = characterCards.filter(character => ['neutral', 'villain'].indexOf(character.affiliation) !== -1);

setCombinations.forEach((setCombination) => {
  buildTeams(
    heroes.filter(character => setCombination.indexOf(character.set) !== -1),
    MAX_POINTS,
    new Team(),
  );

  buildTeams(
    villains.filter(character => setCombination.indexOf(character.set) !== -1),
    MAX_POINTS,
    new Team(),
  );

  cleanUpTeams();
});

calculateStats();

console.log(`Output ${teams.length} teams...`); // eslint-disable-line no-console
jsonfile.writeFile(path.join(__dirname, '../data/teams.json'), teams);
jsonfile.writeFile(path.join(__dirname, '../data/teams_stats.json'), teamsStats);
