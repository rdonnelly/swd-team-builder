import { createSelector } from 'reselect';

import { getDeckCharacters, getDeckAffiliation } from './deckSelectors';
import { filterTeamsByDeck, filterTeamsBySettings, sortTeams } from '../lib/teams';

const getTeams = state => state.teams.teams;

export const getSettings = state => state.teams.settings;
export const getSortOrder = state => state.teams.settings.get('sortOrder');

export const getSortedTeams = createSelector(
  [getTeams, getSortOrder],
  (teams, sortOrder) =>
    sortTeams(teams, sortOrder),
);

export const getFilteredTeamsByDeck = createSelector(
  [getSortedTeams, getDeckCharacters, getDeckAffiliation],
  (sortedTeams, deckCharacters, deckAffiliation) =>
    filterTeamsByDeck(sortedTeams, deckCharacters, deckAffiliation),
);

export const getFilteredTeamsBySettings = createSelector(
  [getFilteredTeamsByDeck, getSettings],
  (teams, deckCharacters, settings) =>
    filterTeamsBySettings(teams, deckCharacters, settings),
);

export const getAvailableTeams = createSelector(
  [getFilteredTeamsBySettings],
  filteredTeams => filteredTeams,
);

export const getAvailableTeamsCount = createSelector(
  [getAvailableTeams],
  availableTeams => availableTeams.count(),
);
