import sets from 'swdestinydb-json-data/sets.json';

import characters from '../../data/characters.json';
import plots from '../../data/plots.json';

import charactersStats from '../../data/characters_stats.json';
import plotsStats from '../../data/plots_stats.json';
import teamsStats from '../../data/teams_stats.json';

const teams = [].concat(
  require('../../data/teams_0.json'),
  require('../../data/teams_1.json'),
  require('../../data/teams_2.json'),
  require('../../data/teams_3.json'),
  require('../../data/teams_4.json'),
  require('../../data/teams_5.json'),
  require('../../data/teams_6.json'),
  require('../../data/teams_7.json'),
  require('../../data/teams_8.json'),
  require('../../data/teams_9.json'),
  require('../../data/teams_10.json'),
  require('../../data/teams_11.json'),
  require('../../data/teams_12.json'),
  require('../../data/teams_13.json'),
  require('../../data/teams_14.json'),
  require('../../data/teams_15.json'),
  require('../../data/teams_16.json'),
  require('../../data/teams_17.json'),
  require('../../data/teams_18.json'),
  require('../../data/teams_19.json'),
  require('../../data/teams_20.json'),
  require('../../data/teams_21.json'),
  require('../../data/teams_22.json'),
  require('../../data/teams_23.json'),
  require('../../data/teams_24.json'),
  require('../../data/teams_25.json'),
  require('../../data/teams_26.json'),
  require('../../data/teams_27.json'),
  require('../../data/teams_28.json'),
  require('../../data/teams_29.json'),
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
  { code: 'ND', name: 'No Damage' },
];

const factions = [
  { code: 'red', name: 'Red' },
  { code: 'blue', name: 'Blue' },
  { code: 'yellow', name: 'Yellow' },
  { code: 'gray', name: 'Gray' },
];

export {
  characters,
  charactersStats,

  plots,
  plotsStats,

  teams,
  teamsStats,

  affiliations,
  damageTypes,
  factions,
  sets,
};
