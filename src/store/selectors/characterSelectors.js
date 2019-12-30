import { createSelector } from 'reselect';
import { charactersStats } from '../../lib/Destiny';

const getCharacterState = (state) => state.characters;

export const getCharacters = createSelector(
  [getCharacterState],
  (characterState) => characterState.characters,
);

export const getQuery = createSelector(
  [getCharacterState],
  (characterState) => characterState.query,
);

export const getCharactersSorted = createSelector(
  [getCharacters],
  (characters) => characters.sort((a, b) => a.rank - b.rank),
);

export const getCharactersSortedAndQueried = createSelector(
  [getCharactersSorted, getQuery],
  (characters, query) => {
    if (!query) {
      return characters;
    }

    const searchRegExp = new RegExp(query, 'i');
    return characters.filter(
      (character) => character.name.search(searchRegExp) !== -1,
    );
  },
);

export const getCharacterCountTotal = createSelector(
  [],
  () => charactersStats.count,
);

export const getCharacterCountCompatible = createSelector(
  [getCharacters],
  (characters) => characters.length,
);

export const getCharacterCountQueried = createSelector(
  [getCharactersSortedAndQueried],
  (characters) => characters.length,
);
