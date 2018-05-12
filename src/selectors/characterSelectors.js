import { createSelector } from 'reselect';

const getCharacterState = state => state.characters;

export const getCharacters = createSelector(
  [getCharacterState],
  characterState => characterState.characters,
);

export const getCharactersSorted = createSelector(
  [getCharacters],
  characters => characters.sort((a, b) => a.rank - b.rank),
);
