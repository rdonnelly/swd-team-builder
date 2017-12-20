import { createSelector } from 'reselect';

const getDeck = state => state.deck;

export const getDeckAffiliation = createSelector(
  [getDeck],
  deck => deck.get('affiliation'),
);

export const getDeckCharacters = createSelector(
  [getDeck],
  deck => deck.get('characters'),
);
