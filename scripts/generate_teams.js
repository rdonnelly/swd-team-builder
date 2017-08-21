#!/usr/bin/env node

import * as _ from 'lodash';
import jsonfile from 'jsonfile';
import path from 'path';
import { characterCards } from '../src/lib/Destiny';

const characterCardsList = characterCards.toList().toJS();

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
    this.sets = [];
    this.affiliation = null;
    this.damageTypes = [];
    this.factions = [];
    this.health = 0;
    this.dice = 0;
    this.points = 0;
  }

  getKey() {
    return this.characters
      .map(character => `${character.id}_${character.isElite ? 2 : 1}_${character.count}`)
      .sort()
      .join('__');
  }

  getCharacterCount() {
    return this.characters.reduce((count, character) => count + character.count, 0);
  }

  hasCharacter(card) {
    return this.characters
      .some(characterCard => characterCard.name === card.name);
  }

  addCharacter(card, isElite) {
    const characterObj = {
      id: card.id,
      name: card.name,
      isElite,
      faction: card.faction,
      count: 1,
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

    this.affiliation = card.affiliation;

    this.health += card.health;

    this.factions.push(card.faction);
    this.factions = _.uniq(this.factions);

    this.damageTypes = _.uniq([].concat(this.damageTypes, card.sides.reduce((acc, val) => {
      if (val.includes('MD')) {
        acc.push('melee');
      }

      if (val.includes('RD')) {
        acc.push('range');
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
    const card = _.find(characterCardsList, { id: characterCard.id });

    if (characterCard.isElite === false) {
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

const checkTeamStats = (team) => {
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
};

const buildTeams = (characters, pointsLeft, team) => {
  const eligibleCharacters = getEligibleCharacters(team, characters, pointsLeft);

  if (checkTeam(team, eligibleCharacters, pointsLeft)) {
    teams.push(team);
    checkTeamStats(team);
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

const heroes = characterCardsList.filter(character => character.affiliation === 'hero');
buildTeams(heroes, MAX_POINTS, new Team());

const villains = characterCardsList.filter(character => character.affiliation === 'villain');
buildTeams(villains, MAX_POINTS, new Team());

teams = _.uniqBy(teams, team => JSON.stringify(team.getKey()));
teams = teams.sort((a, b) => {
  const pointsDiff = b.points - a.points;
  const diceDiff = b.dice - a.dice;
  const healthDiff = b.health - a.health;
  const characterDiff = a.getCharacterCount() - b.getCharacterCount();

  if (diceDiff) {
    return diceDiff;
  }

  if (healthDiff) {
    return healthDiff;
  }

  if (pointsDiff) {
    return pointsDiff;
  }

  return characterDiff;
});

console.log(`Output ${teams.length} teams...`);
jsonfile.writeFile(path.join(__dirname, '../data/teams.json'), teams);
jsonfile.writeFile(path.join(__dirname, '../data/teams_stats.json'), teamsStats);
