import { createSelector } from 'reselect';

const getAll = state => state.characters;

export const getCharacters = createSelector(
  [getAll],
  characters => characters,
);
