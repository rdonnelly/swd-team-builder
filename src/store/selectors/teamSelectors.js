import { createSelector } from 'reselect';

import { getDeckCharacters, getDeckAffiliation, getExcludedCharacterIds } from './deckSelectors';
import { filterTeamsByDeck, filterTeamsBySettings, sortTeams } from '../../lib/teams';

let initialSortRun = true;
let initialFilteredByDeckRun = true;
let initialFilteredBySettingsRun = true;

const getTeamsState = state => state.teams;

export const getTeams = createSelector(
  [getTeamsState],
  teamsState => teamsState.teams,
);

export const getSettings = createSelector(
  [getTeamsState],
  teamsState => teamsState.settings,
);

export const getSortOrder = createSelector(
  [getSettings],
  settings => settings.sortOrder,
);

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
  [getTeamsSorted, getDeckCharacters, getDeckAffiliation, getExcludedCharacterIds],
  (teams, deckCharacters, deckAffiliation, excludedCharacterIds) => {
    if (initialFilteredByDeckRun) {
      initialFilteredByDeckRun = false;
      return teams;
    }

    return filterTeamsByDeck(teams, deckCharacters, deckAffiliation, excludedCharacterIds);
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
  teams => teams.length,
);

export const getAvailableTeamsCountLabel = createSelector(
  [getAvailableTeamsCount],
  count => (count > 1000 ? '1000+' : `${count}`),
);
