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
  red: 0,
  blue: 1,
  yellow: 2,
};

const infiniteFormat = formats.filter(format => format.code === 'INF').pop();

let characters =
  [].concat(
    dbSetAw,
    dbSetSoR,
    dbSetEaW,
    dbSetTPG,
    dbSetLEG,
    dbSetRIV,
    dbSetWotF,
  ).filter(
    rawCard => rawCard.type_code === 'character',
  ).map(
    (rawCard) => {
      const card = {};

      card.affiliation = rawCard.affiliation_code;

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

      card.faction = rawCard.faction_code;
      card.flavorText = rawCard.flavor;
      card.health = rawCard.health;
      card.id = rawCard.code;
      card.illustrator = rawCard.illustrator;
      card.isUnique = rawCard.is_unique;
      card.limit = rawCard.deck_limit;
      card.name = rawCard.name;

      card.points = 0;
      card.pointsRegular = 0;
      card.pointsElite = 0;

      let cardPoints = rawCard.points;
      if (rawCard.code in infiniteFormat.data.balance) {
        cardPoints = infiniteFormat.data.balance[rawCard.code];
      }

      if (cardPoints) {
        card.points = cardPoints.split('/').map(v => parseInt(v, 10));
        card.pointsRegular = card.points[0];
        card.pointsElite = card.points[1];
      }

      card.rarity = rawCard.rarity_code;
      card.set = rawCard.set_code;
      card.sides = rawCard.sides;
      card.subtitle = rawCard.subtitle;
      card.subtypes = rawCard.subtypes;
      card.type = rawCard.type_code;

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
    id: card.id,
    name: card.name,
    subtitle: card.subtitle,
    set: card.set,

    affiliation: card.affiliation,
    damageTypes: card.damageTypes,
    faction: card.faction,

    health: card.health,

    isUnique: card.isUnique,
    pointsRegular: card.pointsRegular,
    pointsElite: card.pointsElite,

    rank: index,
  }));

const charactersObject = {};
characters.forEach((character) => {
  charactersObject[character.id] = character;
});

charactersStats.count = charactersObject.length || 0;


console.log(`Output ${characters.length} characters...`); // eslint-disable-line no-console
jsonfile.writeFile(path.join(__dirname, '../data/characters.json'), charactersObject);
jsonfile.writeFile(path.join(__dirname, '../data/characters_stats.json'), charactersStats);

jsonfile.writeFile(path.join(__dirname, '../data/characters_checksum.json'), {
  checksum: checksum(charactersObject),
  stats_checksum: checksum(charactersStats),
});
