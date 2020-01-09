#!/usr/bin/env node

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

const MIN_DICE = 0;
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

    this.plot = null;
    this.plotId = null;

    this.affiliations = [];
    this.damageTypes = [];
    this.diceCount = 0;
    this.factions = [];
    this.format = format;
    this.health = 0;

    this.plotPoints = null;
    this.characterPoints = 0;
    this.points = 0;

    this.hasModification = false;
    this.restrictedFormats = [];

    this.ranks = {};

    if (plot) {
      this.addPlot(plot);
    }
  }

  getKey() {
    const characterKey = this.characters
      .map(
        (character) =>
          `${character.id}_${character.isElite ? 2 : 1}_${character.count}`,
      )
      .sort()
      .join('__');

    if (this.plotId) {
      return `${this.format}____${characterKey}___${this.plot.id}`;
    }

    return `${this.format}____${characterKey}`;
  }

  addPlot(plot) {
    this.plot = { ...plot };
    this.plotId = plot.id;

    this.affiliations = _.uniq([...this.affiliations, plot.affiliation]);
    this.factions = _.uniq([...this.factions, plot.faction]);

    this.key = this.getKey();
    this.updatePoints();
    return this.isLegal();
  }

  addCharacter(card) {
    const existingCharacterObjByName = this.characters.find(
      (character) => character.name === card.name,
    );

    if (existingCharacterObjByName !== undefined) {
      return false;
    }

    const existingCharacterObjById = this.characters.find(
      (character) => character.id === card.id,
    );

    if (existingCharacterObjById !== undefined) {
      if (card.isUnique) {
        return false;
      }

      // increase count of character
      existingCharacterObjById.count += 1;
    } else {
      this.characters.push({
        id: card.id,
        name: card.name,
        subtypes: card.subtypes,
        count: 1,
        isElite: card.isElite,
        points: card.points,
        pointsToElite: card.pointsToElite,
      });

      if (card.restrictedFormats.indexOf(this.format) !== -1) {
        this.restrictedFormats.push(this.format);
      }

      if (card.hasModification) {
        this.hasModification = true;
      }
    }

    this.affiliations = _.uniq([...this.affiliations, card.affiliation]);
    this.damageTypes = _.uniq([...this.damageTypes, ...card.damageTypes]);
    this.factions = _.uniq([...this.factions, card.faction]);

    this.diceCount += card.hasDie ? (card.isElite ? 2 : 1) : 0;
    this.health += card.health;

    this.characterCount = this.characters.reduce(
      (count, characterObject) => count + characterObject.count,
      0,
    );

    // CHARACTER: Tarfful, 12074
    if (card.id === '12074') {
      const hasWookie = this.hasCharacter({
        subtype: 'wookie',
        excludeId: card.id,
      });
      this.health += hasWookie;
    }

    if (card.subtypes && card.subtypes.includes('wookie')) {
      // CHARACTER: Tarfful, 12074
      const hasTarfful = this.hasCharacter({ id: '12074', excludeId: card.id });
      this.health += hasTarfful;
    }

    // // PLOT: No Allegiance, 08155
    if (
      this.plotId &&
      this.plotId === '08155' &&
      card.affiliation === 'neutral'
    ) {
      this.health += 1;
    }

    this.key = this.getKey();
    this.updatePoints();
    return this.isLegal();
  }

  updatePoints() {
    // PLOT POINTS
    if (this.plot) {
      this.plotPoints = this.plot.points;
    }

    // CHARACTER POINTS
    this.characterPoints = 0;
    this.characters.forEach((character) => {
      this.characterPoints += character.points * character.count;
    });

    // Special Point Modifications
    if (this.hasModification) {
      const hasCloneCommanderCody = this.hasCharacter({ id: '08073' }); // CHARACTER: Clone Commander Cody, 08073
      const hasCloneTrooper = this.hasCharacter({ id: '05038' }); // CHARACTER: Clone Trooper, 05038
      if (hasCloneCommanderCody && hasCloneTrooper) {
        this.characterPoints -= hasCloneTrooper;
      }

      // CHARACTER: General Grievous, 09021
      const hasGeneralGrevious = this.hasCharacter({ id: '09021' });
      const hasDroid = this.hasCharacter({ subtype: 'droid' });
      if (hasGeneralGrevious && hasDroid) {
        this.characterPoints -= hasDroid;
      }

      // CHARACTER: Director Krennic, 12021
      const hasDirectorKrennic = this.hasCharacter({ id: '12021' });
      if (
        hasDirectorKrennic &&
        this.plot &&
        this.plot.subtypes.includes('death-star')
      ) {
        this.characterPoints -= 1;
      }

      // CHARACTER: Kanan Jarrus, 12055
      const hasKananJarrus = this.hasCharacter({ id: '12055' });
      const hasSpectre = this.hasCharacter({ subtype: 'spectre' });
      if (hasKananJarrus && hasSpectre >= 2) {
        this.characterPoints -= 1;
      }

      // CHARACTER: Luke Skywalker, 12056
      const hasLukeSkywalker = this.hasCharacter({ id: '12056' });
      if (
        hasLukeSkywalker &&
        this.plot &&
        this.plot.subtypes.includes('death-star')
      ) {
        this.characterPoints -= 1;
      }
    }

    // TOTAL POINTS
    this.points = (this.plot ? this.plotPoints : 0) + this.characterPoints;
  }

  isLegal() {
    // CHECK POINTS
    // team must be below max points
    if (this.points > MAX_POINTS) {
      return false;
    }

    // check restricted list, no more than 1
    if (this.restrictedFormats.length > 1) {
      return false;
    }

    // CHECK PLOT

    if (this.plot) {
      // PLOT: No Allegiance, 08155
      // must be neutral
      if (
        this.plot.id === '08155' &&
        (this.affiliations.length > 1 || !this.affiliations.includes('neutral'))
      ) {
        return false;
      }

      // PLOT: Solidarity, 08156
      // must be one faction/color and must use all points
      if (this.plot.id === '08156' && this.factions.length > 1) {
        return false;
      }

      // PLOT: Spectre Cell, 12104
      // all characters must have "spectre" subtype
      if (
        this.plot.id === '12104' &&
        !this.characters.every((character) =>
          character.subtypes.includes('spectre'),
        )
      ) {
        return false;
      }
    }

    // CHECK MISC

    if (
      this.hasCharacter({ id: '06001' }) && // CHARACTER: Anakin Skywalker, 06001
      this.hasCharacter({ name: 'Darth Vader' })
    ) {
      // team can not have Anakin Skywalker (06001) and Darth Vader
      return false;
    }

    return true;
  }

  isComplete() {
    // must be legal
    if (!this.isLegal()) {
      return false;
    }

    // must have above min dice
    if (this.diceCount < MIN_DICE) {
      return false;
    }

    // must be above min points
    if (this.points < MIN_POINTS) {
      return false;
    }

    // CHECK CHARACTERS

    if (
      this.hasCharacter({ id: '11059' }) && // CHARACTER: Youngling, 11059
      !this.hasCharacter({ subtype: 'jedi' })
    ) {
      // team can not have Youngling (11059) without a Jedi
      return false;
    }

    if (
      this.hasCharacter({ id: '11095' }) && // CHARACTER: Ewok Warrior, 11059
      !this.hasCharacter({ id: '11093' }) && // CHARACTER: Chief Chirpa, 11093
      !this.hasCharacter({ id: '11097' }) // CHARACTER: Wicket, 11097
    ) {
      // team can not have Ewok Warrior (11095) without a unique Ewok
      return false;
    }

    // CHECK PLOT

    if (this.plot) {
      if (this.plot.points < 0 && this.characterPoints <= MAX_POINTS) {
        // all negative plots must use all points
        return false;
      }

      if (
        this.plot.affiliation !== 'neutral' &&
        !this.affiliations.includes(this.plot.affiliation)
      ) {
        // plot must be neutral and/or share affiliation with character
        return false;
      }

      if (
        this.plot.faction !== 'gray' &&
        !this.factions.includes(this.plot.faction)
      ) {
        // plot must be gray and/or share faction/color with character
        return false;
      }

      if (
        this.plot.id === '08054' &&
        this.characters.every((character) => character.points < 20)
      ) {
        // PLOT: Retribution, 08054
        // must include 20-point character
        return false;
      }

      if (
        this.plot.id === '10016' &&
        this.factions.length >= this.characterCount
      ) {
        // PLOT: Allies of Necessity, 10016
        // two characters must share a faction/color
        return false;
      }
    }

    // team must not fit elite version of one of its characters
    const canFitEliteVersionOfACharacter = this.characters.some((character) => {
      if (!character.pointsToElite) {
        return false;
      }

      return this.points + character.pointsToElite <= MAX_POINTS;
    });

    if (canFitEliteVersionOfACharacter) {
      return false;
    }

    return true;
  }

  hasCharacter({ id, name, subtype, excludeId }) {
    let teamCharacters = [];
    let count = 0;

    if (id) {
      teamCharacters = this.characters.filter(
        (charObj) => charObj.id === id && charObj.id !== excludeId,
      );
    }

    if (name) {
      teamCharacters = this.characters.filter(
        (charObj) => charObj.name === name && charObj.id !== excludeId,
      );
    }

    if (subtype) {
      teamCharacters = this.characters.filter(
        (charObj) =>
          charObj.subtypes &&
          charObj.subtypes.includes(subtype) &&
          charObj.id !== excludeId,
      );
    }

    teamCharacters.forEach((character) => {
      if (character.count) {
        count += character.count;
      }
    });

    return count;
  }
}

// PREPARE PLOTS

const plotVariants = [];

Object.values(plots).forEach((plot) => {
  if (plot.id === '11119') {
    return;
  }

  if (plot.hasModification || plot.restrictedFormats.length !== 0) {
    plotVariants.push({
      affiliation: plot.affiliation,
      faction: plot.faction,
      formats: [...plot.formats],
      id: plot.id,
      points: plot.points,
      restrictedFormats: plot.restrictedFormats,
      subtypes: [...plot.subtypes],
    });
  } else {
    const matchingPlot = plotVariants.find(
      (plotVariant) =>
        plotVariant.id === null &&
        (plotVariant.affiliation === plot.affiliation ||
          plotVariant.affiliation === 'neutral') &&
        (plotVariant.faction === plot.faction ||
          plotVariant.faction === 'gray') &&
        plotVariant.points === plot.points,
    );

    if (matchingPlot === undefined) {
      plotVariants.push({
        affiliation: plot.affiliation,
        faction: plot.faction,
        formats: [...plot.formats],
        id: null,
        points: plot.points,
        restrictedFormats: [],
        subtypes: [],
      });
    } else {
      matchingPlot.formats = _.uniq(matchingPlot.formats.concat(plot.formats));
    }
  }
});

const plotVariantsHero = plotVariants.filter((plot) =>
  ['hero', 'neutral'].includes(plot.affiliation),
);
const plotVariantsVillain = plotVariants.filter((plot) =>
  ['villain', 'neutral'].includes(plot.affiliation),
);

// PREPARE CHARACTERS

const characterVariants = [];

Object.values(characters).forEach((character) => {
  const characterInfo = {
    affiliation: character.affiliation,
    damageTypes: character.damageTypes,
    faction: character.faction,
    formats: character.formats,
    hasDie: character.hasDie,
    hasModification: character.hasModification,
    health: character.health,
    id: character.id,
    isUnique: character.isUnique,
    name: character.name,
    restrictedFormats: character.restrictedFormats,
    set: character.set,
    subtypes: character.subtypes,
  };

  if (character.pointsRegular) {
    characterVariants.push({
      ...characterInfo,
      isElite: false,
      points: character.pointsRegular,
      pointsToElite: character.pointsElite
        ? character.pointsElite - character.pointsRegular
        : null,
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

const characterVariantsHero = characterVariants.filter((character) =>
  ['hero', 'neutral'].includes(character.affiliation),
);
const characterVariantsVillain = characterVariants.filter((character) =>
  ['villain', 'neutral'].includes(character.affiliation),
);
const characterVariantsReylo = characterVariants.filter((character) =>
  ['Kylo Ren', 'Rey'].includes(character.name),
);

const generateTeams = (team, eligibleCharacters) => {
  let checkTeam = true; // should we check the team?

  eligibleCharacters.forEach((character, index) => {
    const newTeam = _.cloneDeep(team);

    // if we can successfully add a character to new team, old team is out
    const success = newTeam.addCharacter(character);

    if (success) {
      checkTeam = false;

      const remainingPoints = MAX_POINTS - team.points;
      const newEligibleCharacters = eligibleCharacters
        .slice(index)
        .filter(
          (eligibleCharacter) =>
            eligibleCharacter.id !== character.id &&
            (eligibleCharacter.points <= remainingPoints ||
              eligibleCharacter.hasModification),
        );

      generateTeams(newTeam, newEligibleCharacters);
    }
  });

  if (checkTeam && team.isComplete()) {
    teams.push(team);
  }
};

async function open() {
  db = await sqlite.open('./swd-teams.db');

  await db.run('DROP TABLE IF EXISTS teams');

  await db.run(`
    CREATE TABLE teams (
      key TEXT PRIMARY KEY,

      plotPoints INTEGER,
      characterPoints INTEGER,
      points INTEGER,

      characterCount INTEGER,
      diceCount INTEGER,
      health INTEGER,

      affiliationHero INTEGER,
      affiliationVillain INTEGER,

      factionBlue INTEGER,
      factionGray INTEGER,
      factionRed INTEGER,
      factionYellow INTEGER,

      damageIndirect INTEGER,
      damageMelee INTEGER,
      damageNone INTEGER,
      damageRanged INTEGER,

      format TEXT,

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
      ?, ?, ?,
      ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?,
      ?, ?, ?, ?
    )
  `);

  const queryPromises = [];

  for (let i = 0, l = teams.length; i < l; i += 1) {
    queryPromises.push(
      insertStmt.run([
        teams[i].key,

        teams[i].plotId ? teams[i].plotPoints : null,
        teams[i].characterPoints,
        teams[i].points,

        teams[i].characterCount,
        teams[i].diceCount,
        teams[i].health,

        teams[i].affiliations.includes('hero'),
        teams[i].affiliations.includes('villain'),

        teams[i].factions.includes('blue'),
        teams[i].factions.includes('gray'),
        teams[i].factions.includes('red'),
        teams[i].factions.includes('yellow'),

        teams[i].damageTypes.includes('ID'),
        teams[i].damageTypes.includes('MD'),
        teams[i].damageTypes.includes('ND'),
        teams[i].damageTypes.includes('RD'),

        teams[i].format,

        teams[i].ranks.characterCount,
        teams[i].ranks.diceCount,
        teams[i].ranks.health,
        teams[i].ranks.points,
      ]),
    );
  }

  await Promise.all(queryPromises);

  await insertStmt.finalize();
}

(async function run() {
  const elibibleFormats = formats.filter((format) => format.code !== 'INF');
  const numFormats = elibibleFormats.length;
  elibibleFormats.forEach(async (format, index) => {
    console.log(
      '\x1b[34m%s\x1b[0m',
      `Generating teams for ${format.name} (${index + 1}/${numFormats})`,
    );
    const numTeams = teams.length;

    // VILLAIN

    const eligibleCharacterVariantsVillain = characterVariantsVillain.filter(
      (characterVariant) => characterVariant.formats.includes(format.code),
    );

    const eligiblePlotVariantsVillain = plotVariantsVillain.filter(
      (plotVariant) => plotVariant.formats.includes(format.code),
    );

    console.log(
      '\x1b[34m%s\x1b[0m',
      `    Villain Character Variants: ${
        eligibleCharacterVariantsVillain.length
      }`,
    );
    console.log(
      '\x1b[34m%s\x1b[0m',
      `    Villain Plot Variants: ${eligiblePlotVariantsVillain.length}`,
    );

    generateTeams(
      new Team({ format: format.code }),
      eligibleCharacterVariantsVillain,
    );
    teams = _.uniqBy(teams, 'key');
    process.stdout.write(`    ${'.'} (${teams.length})\n`);
    eligiblePlotVariantsVillain.forEach((plot, i) => {
      generateTeams(
        new Team({ format: format.code, plot }),
        eligibleCharacterVariantsVillain,
      );
      teams = _.uniqBy(teams, 'key');
      process.stdout.write(`    ${'.'.repeat(i + 2)} (${teams.length})\n`);
    });
    console.log('\n');

    // HERO

    const eligibleCharacterVariantsHero = characterVariantsHero.filter(
      (characterVariant) => characterVariant.formats.includes(format.code),
    );

    const eligiblePlotVariantsHero = plotVariantsHero.filter((plotVariant) =>
      plotVariant.formats.includes(format.code),
    );

    console.log(
      '\x1b[34m%s\x1b[0m',
      `    Hero Character Variants: ${eligibleCharacterVariantsHero.length}`,
    );
    console.log(
      '\x1b[34m%s\x1b[0m',
      `    Hero Plot Variants: ${eligiblePlotVariantsHero.length}`,
    );

    generateTeams(
      new Team({ format: format.code }),
      eligibleCharacterVariantsHero,
    );
    teams = _.uniqBy(teams, 'key');
    process.stdout.write(`    ${'.'} (${teams.length})\n`);
    eligiblePlotVariantsHero.forEach((plot, i) => {
      generateTeams(
        new Team({ format: format.code, plot }),
        eligibleCharacterVariantsHero,
      );
      teams = _.uniqBy(teams, 'key');
      process.stdout.write(`    ${'.'.repeat(i + 2)} (${teams.length})\n`);
    });
    console.log('\n');

    // REYLO

    const eligibleCharacterVariantsReylo = characterVariantsReylo.filter(
      (characterVariant) => characterVariant.formats.includes(format.code),
    );

    console.log(
      '\x1b[34m%s\x1b[0m',
      `    Reylo Character Variants: ${eligibleCharacterVariantsReylo.length}`,
    );

    generateTeams(
      new Team({ format: format.code }),
      eligibleCharacterVariantsReylo,
    );
    teams = _.uniqBy(teams, 'key');
    process.stdout.write(`    ${'.'} (${teams.length})\n`);
    console.log('\n');

    console.log(
      '\x1b[34m\x1b[1m%s\x1b[0m',
      `    Generated ${teams.length - numTeams} Teams (${teams.length} Total)`,
    );
  });

  // SORT TEAMS

  console.log('\x1b[34m%s\x1b[0m', `Sorting ${teams.length} teams...`);

  _.sortBy(teams, ['characterCount', 'diceCount', 'health', 'points'])
    .reverse()
    .map((team, i) => {
      team.ranks.characterCount = i;
      return team;
    });

  _.sortBy(teams, ['points', 'diceCount', 'health', 'characterCount'])
    .reverse()
    .map((team, i) => {
      team.ranks.points = i;
      return team;
    });

  _.sortBy(teams, ['health', 'diceCount', 'points', 'characterCount'])
    .reverse()
    .map((team, i) => {
      team.ranks.health = i;
      return team;
    });

  _.sortBy(teams, ['diceCount', 'health', 'points', 'characterCount'])
    .reverse()
    .map((team, i) => {
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

  jsonfile.writeFile(
    path.join(__dirname, '../data/teams_stats.json'),
    teamsStats,
  );
  jsonfile.writeFile(path.join(__dirname, '../data/teams_checksum.json'), {
    stats_checksum: checksum(teamsStats),
  });

  await open();

  save();

  await close();
})();
