import sets from 'swdestinydb-json-data/sets.json';

import characters from '../../data/characters.json';

import teamsWith1Die from '../../data/teams_1.json';
import teamsWith2Dice from '../../data/teams_2.json';
import teamsWith3Dice from '../../data/teams_3.json';
import teamsWith4Dice from '../../data/teams_4.json';
import teamsWith5Dice from '../../data/teams_5.json';
import teamsWith6Dice from '../../data/teams_6.json';

import teamsStats from '../../data/teams_stats.json';

const teams = [].concat(
  teamsWith6Dice,
  teamsWith5Dice,
  teamsWith4Dice,
  teamsWith3Dice,
  teamsWith2Dice,
  teamsWith1Die,
);

const affiliations = [
  { code: 'villain', name: 'Villain' },
  { code: 'hero', name: 'Hero' },
  { code: 'neutral', name: 'Neutral' },
];

const damageTypes = [
  { code: 'ID', name: 'Indirect Damage' },
  { code: 'MD', name: 'Melee Damage' },
  { code: 'RD', name: 'Range Damage' },
];

const factions = [
  { code: 'red', name: 'Red' },
  { code: 'blue', name: 'Blue' },
  { code: 'yellow', name: 'Yellow' },
  { code: 'gray', name: 'Gray' },
];

export {
  teams,
  teamsStats,

  characters,

  affiliations,
  damageTypes,
  factions,
  sets,
};
