import { createSelector } from 'reselect';

const getDeck = state => state.deck;

export const getDeckAffiliation = createSelector(
  [getDeck],
  deck => deck.affiliation,
);

export const getDeckCharacters = createSelector(
  [getDeck],
  deck => deck.characters,
);

export const getDeckCharactersCount = createSelector(
  [getDeckCharacters],
  characters => characters.length,
);

export const getExcludedCharacterIds = createSelector(
  [getDeck],
  deck => deck.excludedCharacterIds,
);
