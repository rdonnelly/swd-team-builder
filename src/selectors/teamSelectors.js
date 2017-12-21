import { createSelector } from 'reselect';

import { getDeckCharacters, getDeckAffiliation } from './deckSelectors';
import { filterTeamsByDeck, filterTeamsBySettings, sortTeams } from '../lib/teams';

let initialSortRun = true;
let initialFilteredByDeckRun = true;
let initialFilteredBySettingsRun = true;

const getTeams = state => state.teams.teams;

export const getSettings = state => state.teams.settings;
export const getSortOrder = state => state.teams.settings.get('sortOrder');

export const getTeamsSorted = createSelector(
  [getTeams, getSortOrder],
  (teams, sortOrder) => {
    if (initialSortRun) {
      initialSortRun = false;
      return teams;
    }

    return sortTeams(teams, sortOrder);
  },
);

export const getFilteredTeamsByDeck = createSelector(
  [getTeamsSorted, getDeckCharacters, getDeckAffiliation],
  (teams, deckCharacters, deckAffiliation) => {
    if (initialFilteredByDeckRun) {
      initialFilteredByDeckRun = false;
      return teams;
    }

    return filterTeamsByDeck(teams, deckCharacters, deckAffiliation);
  },
);

export const getFilteredTeamsBySettings = createSelector(
  [getFilteredTeamsByDeck, getSettings],
  (teams, deckCharacters, settings) => {
    if (initialFilteredBySettingsRun) {
      initialFilteredBySettingsRun = false;
      return teams;
    }

    return filterTeamsBySettings(teams, deckCharacters, settings);
  },
);

export const getAvailableTeams = createSelector(
  [getFilteredTeamsBySettings],
  teams => teams,
);

export const getAvailableTeamsCount = createSelector(
  [getAvailableTeams],
  teams => teams.count(),
);
