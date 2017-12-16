import { createSelector } from 'reselect';

import { getDeckCharacters } from './deckSelectors';
import { filterTeamsByDeck, filterTeamsBySettings, sortTeams } from '../lib/teams';

const getTeams = state => state.teams.get('teams');

export const getSettings = state => state.teams.get('settings');
export const getSortOrder = state => state.teams.get('sortOrder');

export const getFilteredTeamsBySettings = createSelector(
  [getTeams, getSettings],
  (teams, deckCharacters, settings) =>
    filterTeamsBySettings(teams, deckCharacters, settings),
);

export const getFilteredTeamsByDeck = createSelector(
  [getFilteredTeamsBySettings, getDeckCharacters],
  (teams, deckCharacters, settings) =>
    filterTeamsByDeck(teams, deckCharacters, settings),
);

export const getAvailableTeams = createSelector(
  [getFilteredTeamsByDeck, getSortOrder],
  (filteredTeams, sortOrder) =>
    sortTeams(filteredTeams, sortOrder),
);
