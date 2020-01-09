import { createSelector } from 'reselect';

const getTeamsState = (state) => state.teams;

export const getSettings = createSelector(
  [getTeamsState],
  (teamsState) => teamsState.settings,
);

export const getFilters = createSelector(
  [getSettings],
  (settings) => settings.filters,
);
