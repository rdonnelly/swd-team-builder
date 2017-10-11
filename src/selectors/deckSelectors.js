import { createSelector } from 'reselect';

const getDeck = state => state.deck;

export const getDeckCharacters = createSelector(
  [getDeck],
  deck => deck.get('characters'),
);
