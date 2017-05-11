#!/usr/bin/env node

import * as _ from 'lodash';
import jsonfile from 'jsonfile';
import path from 'path';
import { cards } from '../src/lib/Destiny';

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

class Team {
  constructor() {
    this.key = '';
    this.characters = [];
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

  hasCharacter(card) {
    return this.characters
      .some(characterCard => characterCard.name === card.name);
  }

  addCharacter(card, isElite) {
    const characterObj = {
      id: card.id,
      name: card.name,
      isElite,
      count: 1,
    };

    const existingCharacterObj = this.characters.find(character => character.id === card.id);

    if (existingCharacterObj === undefined) {
      this.characters.push(characterObj);
    } else {
      existingCharacterObj.count += 1;
    }

    this.characters = this.characters.sort((a, b) => a.name - b.name);

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

const teamBuilder = (chars, pointsLeft, team) => {
  const eligibleCharacters = chars
    .filter(character => character.pointsRegular <= pointsLeft)
    .filter(character => !character.isUnique || !team.hasCharacter(character));

  if (eligibleCharacters.length === 0 &&
      team.dice >= MIN_DICE &&
      team.points >= MIN_POINTS) {
    teams.push(team);
    checkTeamStats(team);
  }

  eligibleCharacters.forEach((character) => {
    const regularTeam = _.cloneDeep(team);
    regularTeam.addCharacter(character, false);
    teamBuilder(eligibleCharacters, pointsLeft - character.pointsRegular, regularTeam);

    if (typeof character.pointsElite !== 'undefined' &&
        character.pointsElite <= pointsLeft) {
      const eliteTeam = _.cloneDeep(team);
      eliteTeam.addCharacter(character, true);
      teamBuilder(eligibleCharacters, pointsLeft - character.pointsElite, eliteTeam);
    }
  });
};

const characterCards = cards.toList().toJS()
  .filter(card => card.type === 'character');

const heroes = characterCards.filter(character => character.affiliation === 'hero');
teamBuilder(heroes, MAX_POINTS, new Team());

const villains = characterCards.filter(character => character.affiliation === 'villain');
teamBuilder(villains, MAX_POINTS, new Team());

teams = _.uniqBy(teams, team => JSON.stringify(team.getKey()));
teams = teams.sort((a, b) => b.points - a.points);

console.log(`Output ${teams.length} teams...`);
jsonfile.writeFile(path.join(__dirname, '../data/teams.json'), teams);
jsonfile.writeFile(path.join(__dirname, '../data/teams_stats.json'), teamsStats);
