import { createSelector } from 'reselect';

import { getDeckCharacters } from './deckSelectors';
import { filterTeamsByDeck, filterTeamsBySettings, sortTeams } from '../lib/teams';

const getTeams = state => state.teams.teams;

export const getSettings = state => state.teams.settings;
export const getSortOrder = state => state.teams.settings.get('sortOrder');

export const getFilteredTeamsByDeck = createSelector(
  [getTeams, getDeckCharacters],
  (teams, deckCharacters, settings) =>
    filterTeamsByDeck(teams, deckCharacters, settings),
);

export const getFilteredTeamsBySettings = createSelector(
  [getFilteredTeamsByDeck, getSettings],
  (teams, deckCharacters, settings) =>
    filterTeamsBySettings(teams, deckCharacters, settings),
);

export const getAvailableTeams = createSelector(
  [getFilteredTeamsBySettings, getSortOrder],
  (filteredTeams, sortOrder) =>
    sortTeams(filteredTeams, sortOrder),
);

export const getAvailableTeamsCount = createSelector(
  [getAvailableTeams],
  availableTeams => availableTeams.count(),
);
