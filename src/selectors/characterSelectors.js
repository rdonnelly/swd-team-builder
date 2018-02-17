import { createSelector } from 'reselect';

const getCharacterState = state => state.characters;

export const getCharacters = createSelector(
  [getCharacterState],
  characterState => characterState.characters,
);

export const getCharactersSorted = createSelector(
  [getCharacters],
  characters =>
    characters.sort((a, b) => {
      if (!a.isIncompatible && b.isIncompatible) {
        return -1;
      }

      if (a.isIncompatible && !b.isIncompatible) {
        return 1;
      }

      return a.rank - b.rank;
    }),
);
