#!/usr/bin/env node

import * as _ from 'lodash';
import checksum from 'checksum';
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
    this.chars = [];
    this.cK = [];
    this.c = 0;

    this.s = [];

    this.a = 'neutral';
    this.dT = [];
    this.f = [];
    this.h = 0;
    this.nD = 0;
    this.p = 0;
  }

  getKey() {
    return this.chars
      .map(character => `${character.id}_${character.numDice}_${character.count}`)
      .sort()
      .join('__');
  }

  setCharacterKeys() {
    this.chars.forEach(characterObject =>
      this.cK.push(`${characterObject.id}_${characterObject.numDice}_${characterObject.count}`));
  }

  setCharacterCount() {
    this.cC = this.chars.reduce(
      (count, characterObject) => count + characterObject.count,
      0,
    );
  }

  hasCharacter(card) {
    return this.chars
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

    const existingCharacterObj = this.chars.find(character => character.id === card.id);

    if (existingCharacterObj === undefined) {
      this.chars.push(characterObj);
    } else {
      existingCharacterObj.count += 1;
    }

    this.chars = this.chars.sort((a, b) => {
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

    this.s.push(card.set);
    this.s = _.uniq(this.s);

    if (['hero', 'villain'].indexOf(card.affiliation) !== -1) {
      this.a = card.affiliation;
    }

    this.h += card.health;

    this.f.push(card.faction);
    this.f = _.uniq(this.f);

    this.dT = _.uniq([].concat(this.dT, card.sides.reduce((acc, val) => {
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
      this.nD += 2;
      this.p += card.pointsElite;
    } else {
      this.nD += 1;
      this.p += card.pointsRegular;
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
      team.nD < MIN_DICE ||
      team.p < MIN_POINTS) {
    return false;
  }

  const eliteCheck = _.every(team.chars, (characterCard) => {
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
    if (team.nD < teamsStats.minDice) {
      teamsStats.minDice = team.nD;
    }
    if (team.nD > teamsStats.maxDice) {
      teamsStats.maxDice = team.nD;
    }

    if (team.h < teamsStats.minHealth) {
      teamsStats.minHealth = team.h;
    }
    if (team.h > teamsStats.maxHealth) {
      teamsStats.maxHealth = team.h;
    }

    if (team.p < teamsStats.minPoints) {
      teamsStats.minPoints = team.p;
    }
    if (team.p > teamsStats.maxPoints) {
      teamsStats.maxPoints = team.p;
    }
  });
};

const buildTeams = (characters, pointsLeft, team) => {
  const eligibleCharacters = getEligibleCharacters(team, characters, pointsLeft);

  if (checkTeam(team, eligibleCharacters, pointsLeft)) {
    team.setCharacterCount();
    team.setCharacterKeys();
    delete team.chars;
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
  teams = _.filter(teams, team => team.cC > 0);

  teams = _.uniqBy(teams, team => JSON.stringify(team.key));

  teams = _.sortBy(teams, ['nD', 'h', 'p', 'cC']).map((team, index) => {
    team.rD = index;
    return team;
  });

  teams = _.sortBy(teams, ['h', 'nD', 'p', 'cC']).map((team, index) => {
    team.rH = index;
    return team;
  });

  teams = _.sortBy(teams, ['p', 'nD', 'h', 'cC']).map((team, index) => {
    team.rP = index;
    return team;
  });

  teams = _.sortBy(teams, ['cC', 'nD', 'h', 'p']).map((team, index) => {
    team.rC = index;
    return team;
  });

  teams = _.sortBy(teams, ['nD', 'h', 'p', 'cC']);
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
jsonfile.writeFile(path.join(__dirname, '../data/teams_checksum.json'), { checksum: checksum(path.join(__dirname, '../data/teams.json')) });
