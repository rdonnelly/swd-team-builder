import * as _ from 'lodash';
import checksum from 'json-checksum';
import jsonfile from 'jsonfile';
import path from 'path';

// import dbSetAw from 'swdestinydb-json-data/set/AW.json';
// import dbSetSoR from 'swdestinydb-json-data/set/SoR.json';
// import dbSetEaW from 'swdestinydb-json-data/set/EaW.json';
import dbSetTPG from 'swdestinydb-json-data/set/TPG.json';
import dbSetLEG from 'swdestinydb-json-data/set/LEG.json';
import dbSetRIV from 'swdestinydb-json-data/set/RIV.json';
import dbSetWotF from 'swdestinydb-json-data/set/WotF.json';
import dbSetAtG from 'swdestinydb-json-data/set/AtG.json';
import dbSetConv from 'swdestinydb-json-data/set/CONV.json';
import dbSetAoN from 'swdestinydb-json-data/set/AoN.json';
import dbSetSoH from 'swdestinydb-json-data/set/SoH.json';

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
    // dbSetAw,
    // dbSetSoR,
    // dbSetEaW,
    dbSetTPG,
    dbSetLEG,
    dbSetRIV,
    dbSetWotF,
    dbSetAtG,
    dbSetConv,
    dbSetAoN,
    dbSetSoH,
  ).filter(
    (rawCard) => rawCard.type_code === 'character',
  ).map(
    (rawCard) => {
      const card = {};

      card.affiliation = rawCard.affiliation_code;
      card.damageTypes = [];
      card.faction = rawCard.faction_code;
      card.formats = [];
      card.hasDie = rawCard.has_die;
      card.health = rawCard.health;
      card.id = rawCard.code;
      card.isUnique = rawCard.is_unique;
      card.name = rawCard.name;
      card.pointsElite = null;
      card.pointsRegular = null;
      card.restrictedFormats = [];
      card.set = rawCard.set_code;
      card.subtitle = rawCard.subtitle;
      card.subtypes = rawCard.subtypes;

      // set damage types
      card.damageTypes = [];
      if (rawCard.sides) {
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
      }

      if (card.id === '05050') { // CHARACTER: Zeb Orrelios, 05050
        card.damageTypes.push('RD');
      }

      if (card.id === '07056') { // CHARACTER: Luke Skywalker, 07056
        card.damageTypes.push('MD');
      }

      if (card.id === '09018') { // CHARACTER: Captain Phasma, 09018
        card.damageTypes.push('MD');
      }

      if (card.id === '09075') { // CHARACTER: Padmé Amidala, 09075
        card.damageTypes.push('ID');
      }

      if (card.damageTypes.length === 0) {
        card.damageTypes = ['ND']; // no damage
      }

      formats.forEach((format) => {
        if (format.data.sets.includes(rawCard.set_code)) {
          card.formats.push(format.code);
        }

        if (format && format.data && format.data.restricted) {
          format.data.restricted.forEach((restrictedId) => {
            if (restrictedId === rawCard.code) {
              card.restrictedFormats.push(format.code);
            }
          });
        }
      });

      // set card points
      let cardPoints = rawCard.points;
      if (rawCard.code in infiniteFormat.data.balance) {
        cardPoints = infiniteFormat.data.balance[rawCard.code];
      }

      if (cardPoints) {
        const cardPointsSplit = cardPoints.split('/').map((v) => parseInt(v, 10));
        [card.pointsRegular, card.pointsElite] = cardPointsSplit;
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

    if (a.id !== b.id) {
      return a.id ? -1 : 1;
    }

    return 0;
  });

characters = characters
  .map((card, index) => ({
    affiliation: card.affiliation,
    damageTypes: card.damageTypes,
    faction: card.faction,
    formats: card.formats,
    hasDie: card.hasDie,
    health: card.health,
    id: card.id,
    isUnique: card.isUnique,
    name: card.name,
    pointsElite: card.pointsElite,
    pointsRegular: card.pointsRegular,
    restrictedFormats: card.restrictedFormats,
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
