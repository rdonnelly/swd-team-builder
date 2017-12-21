import sets from 'swdestinydb-json-data/sets.json';

import characters from '../../data/characters.json';

import heroTeams from '../../data/hero_teams.json';
import villainTeams from '../../data/villain_teams.json';
import neutralTeams from '../../data/neutral_teams.json';
import teamsStats from '../../data/teams_stats.json';

const teams = [].concat(heroTeams, villainTeams, neutralTeams);

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
