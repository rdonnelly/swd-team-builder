#!/usr/bin/env node

/* eslint-disable no-console */

import * as _ from 'lodash';
import checksum from 'json-checksum';
import jsonfile from 'jsonfile';
import path from 'path';
import sqlite from 'sqlite';

import formats from 'swdestinydb-json-data/formats.json';

import characters from '../data/characters.json';
import plots from '../data/plots.json';

const AFFILIATION_RANK = {
  villain: 0,
  hero: 1,
  neutral: 2,
};

const MIN_DICE = 2;
const MIN_POINTS = 20;
const MAX_POINTS = 30;

let db;

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


// TEAM CLASS


class Team {
  constructor({ format = null, plot = null }) {
    this.key = null;

    this.characters = [];
    this.characterCount = 0;
    this.characterPoints = 0;

    this.plot = null;
    this.plotId = null;
    this.plotPoints = null;

    this.affiliations = [];
    this.damageTypes = [];
    this.diceCount = 0;
    this.factions = [];
    this.format = format;
    this.health = 0;
    this.points = 0;
    this.sets = [];

    this.ranks = {};

    if (plot) {
      this.addPlot(plot);
    }
  }

  getKey() {
    const characterKey = this.characters
      .map((character) => `${character.id}_${character.isElite ? 2 : 1}_${character.count}`)
      .sort()
      .join('__');

    if (this.plot && this.plot.hasModification) {
      return `${characterKey}___${this.plot.id}`;
    }

    return `${this.format}____${characterKey}`;
  }

  addCharacter(card) {
    const existingCharacterObjById = this.characters.find(
      (character) => character.id === card.id,
    );
    const existingCharacterObjByName = this.characters.find(
      (character) => character.name === card.name,
    );

    if (existingCharacterObjById === undefined) {
      if (existingCharacterObjByName === undefined) {
        this.characters.push({
          id: card.id,
          name: card.name,
          subtypes: card.subtypes,
          count: 1,
          isElite: card.isElite,
          pointsToElite: card.pointsToElite,
        });
      } else {
        return false;
      }
    } else {
      if (card.isUnique) {
        return false;
      }

      existingCharacterObjById.count += 1;
    }

    this.affiliations = _.uniq([...this.affiliations, card.affiliation]);
    this.damageTypes = _.uniq([...this.damageTypes, ...card.damageTypes]);
    this.factions = _.uniq([...this.factions, card.faction]);
    this.sets = _.uniq([...this.sets, card.set]);

    this.diceCount += card.isElite ? 2 : 1;
    this.health += card.health;
    this.points += card.points;

    this.characterCount = this.characters.reduce(
      (count, characterObject) => count + characterObject.count, 0,
    );
    this.characterPoints += card.points;

    this.key = this.getKey();

    // TODO modifications below should not be able to find self

    if (card.id === '05038') { // CHARACTER: Clone Trooper, 05038
      this.characterPoints -= this.hasCharacter({ id: '08073' }); // CHARACTER: Clone Commander Cody, 08073
      this.points -= this.hasCharacter({ id: '08073' }); // CHARACTER: Clone Commander Cody, 08073
    }

    if (card.id === '08073') { // CHARACTER: Clone Commander Cody, 08073
      this.characterPoints -= this.hasCharacter({ id: '05038' }); // CHARACTER: Clone Trooper, 05038
      this.points -= this.hasCharacter({ id: '05038' }); // CHARACTER: Clone Trooper, 05038
    }

    if (card.id === '09021') { // CHARACTER: General Grievous, 09021
      this.characterPoints -= this.hasCharacter({ subtype: 'droid' });
      this.points -= this.hasCharacter({ subtype: 'droid' });
    }

    if (card.subtypes && card.subtypes.includes('droid')) {
      this.characterPoints -= this.hasCharacter({ id: '09021' }); // CHARACTER: General Grievous, 09021
      this.points -= this.hasCharacter({ id: '09021' }); // CHARACTER: General Grievous, 09021
    }

    if (this.plot && this.plot.id === '08155' && // PLOT: No Allegiance, 08155
        card.affiliation === 'neutral') {
      this.health += 1;
    }

    return true;
  }

  addPlot(plot) {
    this.plot = { ...plot };
    this.key = this.getKey();

    this.plotId = plot.id;
    this.plotPoints = plot.points;

    this.affiliations = _.uniq([...this.affiliations, plot.affiliation]);
    this.factions = _.uniq([...this.factions, plot.faction]);
    this.sets = _.uniq([...this.sets, plot.sets]);
    this.points += plot.points;
  }

  hasCharacter({ id, name, subtype }) {
    let teamCharacters = [];
    let count = 0;

    if (id) {
      teamCharacters = this.characters.filter((charObj) => charObj.id === id);
    }

    if (name) {
      teamCharacters = this.characters.filter((charObj) => charObj.name === name);
    }

    if (subtype) {
      teamCharacters = this.characters.filter(
        (charObj) => charObj.subtypes && charObj.subtypes.includes(subtype),
      );
    }

    teamCharacters.forEach((character) => {
      if (character.count) {
        count += character.count;
      }
    });

    return count;
  }

  isLegal() {
    // team must be above min points and below max points
    if (this.points > MAX_POINTS) {
      return false;
    }

    // team must not have Anakin Skywalker (06001) and Darth Vader
    if (this.hasCharacter({ id: '06001' }) && // CHARACTER: Anakin Skywalker, 06001
        this.hasCharacter({ name: 'Darth Vader' })) {
      return false;
    }

    // CHECK PLOT

    if (this.plot) {
      if (this.plot.id === '08155') { // PLOT: No Allegiance, 08155
        // must be neutral
        if (this.affiliations.length > 1 ||
            !this.affiliations.includes('neutral')) {
          return false;
        }
      }

      if (this.plot.id === '08156') { // PLOT: Solidarity, 08156
        // must be one faction/color and must use all points
        if (this.factions.length > 1) {
          return false;
        }
      }

      // plot must be neutral and/or share affiliation with character
      if (this.plot.affiliation !== 'neutral' &&
          !this.affiliations.includes(this.plot.affiliation)) {
        return false;
      }

      // plot must be gray and/or share faction/color with character
      if (this.plot.faction !== 'gray' &&
          !this.factions.includes(this.plot.faction)) {
        return false;
      }
    }

    return true;
  }

  isComplete() {
    // team must be legal
    if (!this.isLegal()) {
      return false;
    }

    // team must have above min dice
    if (this.diceCount < MIN_DICE) {
      return false;
    }

    // team must be above min points and below max points
    if (this.points < MIN_POINTS || this.points > MAX_POINTS) {
      return false;
    }

    // CHECK PLOT

    // TODO need to check that other -1 plots are not being used when you don't need them
    // e.g. Bitter Rivalry, 08115

    if (this.plot) {
      if (this.plot.id === '08054') { // PLOT: Retribution, 08054
        // must include 20-point character
        if (this.characters.every((character) => character.points < 20)) {
          return false;
        }
      }

      if (this.plot.id === '08155') { // PLOT: No Allegiance, 08155
        // must be neutral
        if (this.affiliations.length > 1 ||
            !this.affiliations.includes('neutral')) {
          return false;
        }
      }

      if (this.plot.id === '08156') { // PLOT: Solidarity, 08156
        // must be one faction/color and must use all points
        if (this.factions.length !== 1 ||
            this.characterPoints <= MAX_POINTS) {
          return false;
        }
      }

      if (this.plot.id === '10016') { // PLOT: Allies of Necessity, 10016
        // two characters must share a faction/color and must use all points
        if (this.factions.length >= this.characterCount ||
            this.characterPoints <= MAX_POINTS) {
          return false;
        }
      }

      // plot must be neutral and/or share affiliation with character
      if (this.plot.affiliation !== 'neutral' &&
          !this.affiliations.includes(this.plot.affiliation)) {
        return false;
      }

      // plot must be gray and/or share faction/color with character
      if (this.plot.faction !== 'gray' &&
          !this.factions.includes(this.plot.faction)) {
        return false;
      }
    }

    // team must not fit elite version of one of its characters
    const canFitEliteVersionOfCharacter = this.characters.some((character) => {
      if (!character.pointsToElite) {
        return false;
      }

      return this.points + character.pointsToElite <= MAX_POINTS;
    });
    if (canFitEliteVersionOfCharacter) {
      return false;
    }

    return true;
  }
}


// PREPARE PLOTS


const plotVariants = [];

Object.values(plots).forEach((plot) => {
  if (plot.hasRestriction || plot.hasModification) {
    plotVariants.push({
      affiliation: plot.affiliation,
      faction: plot.faction,
      formats: plot.formats,
      hasModification: plot.hasModification,
      hasRestriction: plot.hasRestriction,
      id: plot.id,
      points: plot.points,
      sets: [plot.set],
    });
  } else {
    const matchingPlot = plotVariants.find(
      (plotVariant) => plotVariant.affiliation === plot.affiliation &&
        plotVariant.faction === plot.faction &&
        plotVariant.points === plot.points,
    );

    if (matchingPlot === undefined) {
      plotVariants.push({
        affiliation: plot.affiliation,
        faction: plot.faction,
        formats: plot.formats,
        hasModification: plot.hasModification,
        hasRestriction: plot.hasRestriction,
        id: null,
        points: plot.points,
        sets: [plot.set],
      });
    } else if (!matchingPlot.sets.includes(plot.set)) {
      matchingPlot.sets.push(plot.set);
    }
  }
});

const plotVariantsHero = plotVariants.filter((plot) => ['hero', 'neutral'].includes(plot.affiliation));
const plotVariantsVillain = plotVariants.filter((plot) => ['villain', 'neutral'].includes(plot.affiliation));


// PREPARE CHARACTERS

const characterVariants = [];

Object.values(characters).forEach((character) => {
  const characterInfo = {
    affiliation: character.affiliation,
    damageTypes: character.damageTypes,
    faction: character.faction,
    formats: character.formats,
    health: character.health,
    id: character.id,
    isUnique: character.isUnique,
    name: character.name,
    set: character.set,
    subtypes: character.subtypes,
  };

  if (character.pointsRegular) {
    characterVariants.push({
      ...characterInfo,
      isElite: false,
      points: character.pointsRegular,
      pointsToElite: character.pointsElite ? character.pointsElite - character.pointsRegular : null,
    });
  }

  if (character.pointsElite) {
    characterVariants.push({
      ...characterInfo,
      isElite: true,
      points: character.pointsElite,
    });
  }
});

characterVariants.sort((a, b) => {
  if (a.points !== b.points) {
    return b.points - a.points;
  }

  const affiliationRankA = AFFILIATION_RANK[a.affiliation];
  const affiliationRankB = AFFILIATION_RANK[b.affiliation];
  if (affiliationRankA !== affiliationRankB) {
    return affiliationRankA - affiliationRankB;
  }

  return 0;
});

const characterVariantsHero = characterVariants.filter((character) => ['hero', 'neutral'].includes(character.affiliation));
const characterVariantsVillain = characterVariants.filter((character) => ['villain', 'neutral'].includes(character.affiliation));


const generateTeams = (team, eligibleCharacters) => {
  let teamIsComplete = true;

  eligibleCharacters.forEach((character) => {
    const newTeam = _.cloneDeep(team);
    const success = newTeam.addCharacter(character);

    if (success && newTeam.isLegal()) {
      teamIsComplete = false;
      const index = eligibleCharacters.findIndex((c) => c.points === character.points);
      const newEligibleCharacters = index === -1 ?
        eligibleCharacters : eligibleCharacters.slice(index);
      generateTeams(newTeam, newEligibleCharacters);
    }
  });


  if (teamIsComplete && team.isComplete()) {
    delete team.characters;
    delete team.plot;
    teams.push(team);
  }
};

async function open() {
  db = await sqlite.open('./swd-teams.db');

  await db.run('DROP TABLE IF EXISTS teams');

  await db.run(`
    CREATE TABLE teams (
      key TEXT PRIMARY KEY,

      characterCount INTEGER,
      diceCount INTEGER,
      health INTEGER,
      plotPoints INTEGER,
      points INTEGER,
      sets TEXT,

      affiliationHero INTEGER,
      affiliationNeutral INTEGER,
      affiliationVillain INTEGER,

      factionBlue INTEGER,
      factionGray INTEGER,
      factionRed INTEGER,
      factionYellow INTEGER,

      damageIndirect INTEGER,
      damageMelee INTEGER,
      damageNone INTEGER,
      damageRanged INTEGER,

      formatInf INTEGER,
      formatStd INTEGER,
      formatTri INTEGER,

      rankCharacterCount INTEGER,
      rankDiceCount INTEGER,
      rankHealth INTEGER,
      rankPoints INTEGER
    );
  `);
}

async function close() {
  await db.close();
}

async function save() {
  const insertStmt = await db.prepare(`
    INSERT INTO teams VALUES (
      ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  const queryPromises = [];

  for (let i = 0, l = teams.length; i < l; i += 1) {
    queryPromises.push(insertStmt.run([
      teams[i].key,

      teams[i].characterCount,
      teams[i].diceCount,
      teams[i].health,
      teams[i].plotId ? teams[i].plotPoints : null,
      teams[i].characterPoints,
      teams[i].sets.join('_').toLowerCase(),

      teams[i].affiliations.includes('hero'),
      teams[i].affiliations.includes('neutral'),
      teams[i].affiliations.includes('villain'),

      teams[i].factions.includes('blue'),
      teams[i].factions.includes('gray'),
      teams[i].factions.includes('red'),
      teams[i].factions.includes('yellow'),

      teams[i].damageTypes.includes('ID'),
      teams[i].damageTypes.includes('MD'),
      teams[i].damageTypes.includes('ND'),
      teams[i].damageTypes.includes('RD'),

      teams[i].format === 'INF',
      teams[i].format === 'STD',
      teams[i].format === 'TRI',

      teams[i].ranks.characterCount,
      teams[i].ranks.diceCount,
      teams[i].ranks.health,
      teams[i].ranks.points,
    ]));
  }

  await Promise.all(queryPromises);

  await insertStmt.finalize();
}


(async function run() {
  await open();

  const elibibleFormats = formats.filter((format) => format.code !== 'INF');
  const numFormats = elibibleFormats.length;
  elibibleFormats.forEach(async (format, index) => {
    console.log('\x1b[34m%s\x1b[0m', `Generating teams for ${format.name} (${index + 1}/${numFormats})`);
    const numTeams = teams.length;

    // VILLAIN

    const eligibleCharacterVariantsVillain = characterVariantsVillain.filter(
      (characterVariant) => characterVariant.formats.includes(format.code),
    );

    const eligiblePlotVariantsVillain = plotVariantsVillain.filter(
      (plotVariant) => plotVariant.formats.includes(format.code),
    );

    console.log('\x1b[34m%s\x1b[0m', `    Villain Character Variants: ${eligibleCharacterVariantsVillain.length}`);
    console.log('\x1b[34m%s\x1b[0m', `    Villain Plot Variants: ${eligiblePlotVariantsVillain.length}`);

    generateTeams(new Team({ format: format.code }), eligibleCharacterVariantsVillain);
    process.stdout.write(`    ${'.'}\r`);
    eligiblePlotVariantsVillain.forEach((plot, i) => {
      generateTeams(new Team({ format: format.code, plot }), eligibleCharacterVariantsVillain);
      process.stdout.write(`    ${'.'.repeat(i + 2)}\r`);
    });
    console.log('\n');

    teams = _.uniqBy(teams, 'key');

    // HERO

    const eligibleCharacterVariantsHero = characterVariantsHero.filter(
      (characterVariant) => characterVariant.formats.includes(format.code),
    );

    const eligiblePlotVariantsHero = plotVariantsHero.filter(
      (plotVariant) => plotVariant.formats.includes(format.code),
    );

    console.log('\x1b[34m%s\x1b[0m', `    Hero Character Variants: ${eligibleCharacterVariantsHero.length}`);
    console.log('\x1b[34m%s\x1b[0m', `    Hero Plot Variants: ${eligiblePlotVariantsHero.length}`);

    generateTeams(new Team({ format: format.code }), eligibleCharacterVariantsHero);
    process.stdout.write(`    ${'.'}\r`);
    eligiblePlotVariantsHero.forEach((plot, i) => {
      generateTeams(new Team({ format: format.code, plot }), eligibleCharacterVariantsHero);
      process.stdout.write(`    ${'.'.repeat(i + 2)}\r`);
    });
    console.log('\n');

    teams = _.uniqBy(teams, 'key');

    console.log('\x1b[34m\x1b[1m%s\x1b[0m', `    Generated ${teams.length - numTeams} Teams (${teams.length} Total)`);
  });

  // SORT TEAMS

  console.log('\x1b[34m%s\x1b[0m', `Sorting ${teams.length} teams...`);

  _.sortBy(teams, ['characterCount', 'diceCount', 'health', 'points']).reverse().map((team, i) => {
    team.ranks.characterCount = i;
    return team;
  });

  _.sortBy(teams, ['points', 'diceCount', 'health', 'characterCount']).reverse().map((team, i) => {
    team.ranks.points = i;
    return team;
  });

  _.sortBy(teams, ['health', 'diceCount', 'points', 'characterCount']).reverse().map((team, i) => {
    team.ranks.health = i;
    return team;
  });

  _.sortBy(teams, ['diceCount', 'health', 'points', 'characterCount']).reverse().map((team, i) => {
    team.ranks.diceCount = i;
    return team;
  });

  // CALCULATE STATS

  console.log('\x1b[34m%s\x1b[0m', 'Calculating stats...');

  teams.forEach((team) => {
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

    if (team.characterPoints < teamsStats.minPoints) {
      teamsStats.minPoints = team.characterPoints;
    }
    if (team.characterPoints > teamsStats.maxPoints) {
      teamsStats.maxPoints = team.characterPoints;
    }
  });

  teamsStats.count = teams.length || 0;

  console.log('\x1b[32m\x1b[1m%s\x1b[0m', `Generated ${teams.length} teams`);

  jsonfile.writeFile(path.join(__dirname, '../data/teams_stats.json'), teamsStats);
  jsonfile.writeFile(path.join(__dirname, '../data/teams_checksum.json'), {
    stats_checksum: checksum(teamsStats),
  });

  save();

  await close();
}());
