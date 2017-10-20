import sets from 'swdestinydb-json-data/sets.json';

import dbSetAw from 'swdestinydb-json-data/set/AW.json';
import dbSetSoR from 'swdestinydb-json-data/set/SoR.json';
import dbSetEaW from 'swdestinydb-json-data/set/EaW.json';
import dbSetTPG from 'swdestinydb-json-data/set/TPG.json';
import dbSetLEG from 'swdestinydb-json-data/set/LEG.json';
import dbSetRIV from 'swdestinydb-json-data/set/RIV.json';

import teams from '../../data/teams.json';
import teamsStats from '../../data/teams_stats.json';

const characterCards =
  [].concat(
    dbSetAw,
    dbSetSoR,
    dbSetEaW,
    dbSetTPG,
    dbSetLEG,
    dbSetRIV,
  ).filter(
    rawCard => rawCard.type_code === 'character',
  ).map(
    (rawCard) => {
      const card = {};

      card.affiliation = rawCard.affiliation_code;
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
      if (rawCard.points) {
        card.points = rawCard.points.split('/').map(v => parseInt(v, 10));
        card.pointsRegular = card.points[0];
        card.pointsElite = card.points[1];
      }

      card.rarity = rawCard.rarity_code;
      card.set = rawCard.set_code;
      card.sides = rawCard.sides;
      card.subtitle = rawCard.subtitle;
      card.type = rawCard.type_code;

      return card;
    },
  );

const damageTypes = [
  { code: 'ID', name: 'Indirect Damage' },
  { code: 'MD', name: 'Melee Damage' },
  { code: 'RD', name: 'Range Damage' },
];

export {
  sets,

  characterCards,

  teams,
  teamsStats,

  damageTypes,
};
