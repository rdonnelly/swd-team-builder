import * as _ from 'lodash';
import checksum from 'json-checksum';
import jsonfile from 'jsonfile';
import path from 'path';

import dbSetAw from 'swdestinydb-json-data/set/AW.json';
import dbSetSoR from 'swdestinydb-json-data/set/SoR.json';
import dbSetEaW from 'swdestinydb-json-data/set/EaW.json';
import dbSetTPG from 'swdestinydb-json-data/set/TPG.json';
import dbSetLEG from 'swdestinydb-json-data/set/LEG.json';
import dbSetRIV from 'swdestinydb-json-data/set/RIV.json';
import dbSetWotF from 'swdestinydb-json-data/set/WotF.json';
import dbSetAtG from 'swdestinydb-json-data/set/AtG.json';
import dbSetConv from 'swdestinydb-json-data/set/CONV.json';
import dbSetAoN from 'swdestinydb-json-data/set/AoN.json';

import formats from 'swdestinydb-json-data/formats.json';

const charactersStats = {
  count: 0,
};

const affiliationOrder = {
  villain: 0,
  hero: 1,
  neutral: 2,
};

const factionOrder = {
  blue: 0,
  red: 1,
  yellow: 2,
  gray: 3,
};

const infiniteFormat = formats.filter((format) => format.code === 'INF').pop();

let characters =
  [].concat(
    dbSetAw,
    dbSetSoR,
    dbSetEaW,
    dbSetTPG,
    dbSetLEG,
    dbSetRIV,
    dbSetWotF,
    dbSetAtG,
    dbSetConv,
    dbSetAoN,
  ).filter(
    (rawCard) => rawCard.type_code === 'character',
  ).map(
    (rawCard) => {
      const card = {};

      card.affiliation = rawCard.affiliation_code;
      card.damageTypes = [];
      card.faction = rawCard.faction_code;
      card.health = rawCard.health;
      card.id = rawCard.code;
      card.isUnique = rawCard.is_unique;
      card.name = rawCard.name;
      card.pointsElite = null;
      card.pointsRegular = null;
      card.set = rawCard.set_code;
      card.subtitle = rawCard.subtitle;
      card.subtypes = rawCard.subtypes;

      // set damage types
      card.damageTypes = _.uniq(rawCard.sides.reduce((acc, val) => {
        if (val.includes('ID')) {
          acc.push('ID');
        }

        if (val.includes('MD')) {
          acc.push('MD');
        }

        if (val.includes('RD')) {
          acc.push('RD');
        }

        return acc.sort();
      }, []));

      if (card.damageTypes.length === 0) {
        card.damageTypes = ['ND']; // no damage
      }

      // set card points
      let cardPoints = rawCard.points;
      if (rawCard.code in infiniteFormat.data.balance) {
        cardPoints = infiniteFormat.data.balance[rawCard.code];
      }

      if (cardPoints) {
        const cardPointsSplit = cardPoints.split('/').map((v) => parseInt(v, 10));
        card.pointsRegular = cardPointsSplit[0]; // eslint-disable-line prefer-destructuring
        card.pointsElite = cardPointsSplit[1]; // eslint-disable-line prefer-destructuring
      }

      return card;
    },
  );

characters = characters
  .sort((a, b) => {
    if (a.affiliation !== b.affiliation) {
      return affiliationOrder[a.affiliation] - affiliationOrder[b.affiliation];
    }

    if (a.faction !== b.faction) {
      return factionOrder[a.faction] - factionOrder[b.faction];
    }

    if (a.isUnique !== b.isUnique) {
      return a.isUnique ? -1 : 1;
    }

    if (a.name !== b.name) {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : 1;
    }

    return 0;
  });

characters = characters
  .map((card, index) => ({
    affiliation: card.affiliation,
    damageTypes: card.damageTypes,
    faction: card.faction,
    health: card.health,
    id: card.id,
    isUnique: card.isUnique,
    name: card.name,
    pointsElite: card.pointsElite,
    pointsRegular: card.pointsRegular,
    set: card.set,
    subtitle: card.subtitle,
    subtypes: card.subtypes,
    types: card.type,

    rank: index,
  }));

const charactersObject = {};
characters.forEach((character) => {
  charactersObject[character.id] = character;
});

charactersStats.count = characters.length || 0;


console.log(`Output ${characters.length} characters...`); // eslint-disable-line no-console
jsonfile.writeFile(path.join(__dirname, '../data/characters.json'), charactersObject);
jsonfile.writeFile(path.join(__dirname, '../data/characters_stats.json'), charactersStats);
jsonfile.writeFile(path.join(__dirname, '../data/characters_checksum.json'), {
  checksum: checksum(charactersObject),
  stats_checksum: checksum(charactersStats),
});
