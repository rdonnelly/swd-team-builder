import { createSelector } from 'reselect';

import { getDeckCharacters } from './deckSelectors';
import { filterAndSortTeams } from '../lib/teams';

const getTeams = state => state.teams.get('teams');

export const getSettings = state => state.teams.get('settings');
export const getSortOrder = state => state.teams.get('sortOrder');

export const getAvailableTeams = createSelector(
  [getTeams, getDeckCharacters, getSettings, getSortOrder],
  (teams, deckCharacters, settings, sortOrder) =>
    filterAndSortTeams(teams, deckCharacters, settings, sortOrder),
);
