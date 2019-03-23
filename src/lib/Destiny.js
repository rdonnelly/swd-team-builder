import sets from 'swdestinydb-json-data/sets.json';

import characters from '../../data/characters.json';
import plots from '../../data/plots.json';

import charactersStats from '../../data/characters_stats.json';
import plotsStats from '../../data/plots_stats.json';
import teamsStats from '../../data/teams_stats.json';

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

  teamsStats,

  affiliations,
  damageTypes,
  factions,
  sets,
};
