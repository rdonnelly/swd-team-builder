import Immutable from 'immutable';

import { characterCards } from '../lib/Destiny';

const affiliationRank = {
  villain: 0,
  hero: 1,
};

const factionRank = {
  red: 0,
  blue: 1,
  yellow: 2,
};

const initialState = Immutable.fromJS({
  cards: characterCards
    .filter(card => card.get('type') === 'character')
    .sort((a, b) => {
      if (b.get('affiliation') !== a.get('affiliation')) {
        return affiliationRank[b.get('affiliation')] < affiliationRank[a.get('affiliation')] ? 1 : -1;
      }

      if (b.get('faction') !== a.get('faction')) {
        return factionRank[b.get('faction')] < factionRank[a.get('faction')] ? 1 : -1;
      }

      if (b.get('isUnique') !== a.get('isUnique')) {
        return b.get('isUnique') > a.get('isUnique') ? 1 : -1;
      }

      if (b.get('name') !== a.get('name')) {
        return b.get('name') < a.get('name') ? 1 : -1;
      }

      return 0;
    })
    .map(card => (Immutable.fromJS({
      id: card.get('id'),
      name: card.get('name'),
      inDeck: false,
      isCompatibile: true,
    }))),
});

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHARACTERS': {
      return state.update('cards', cards =>
        cards.map(characterCard =>
          characterCard
            .set('inDeck', action.payload.deckCards.some(deckCard => deckCard.get('id') === characterCard.get('id')))
            .set('isCompatibile',
              action.payload.deckCards.every(
                deckCard =>
                  characterCards.get(deckCard.get('id')).affiliation ===
                  characterCards.get(characterCard.get('id')).affiliation)),
        ),
      );
    }

    case 'RESET_CHARACTERS': {
      return state
        .set('cards', initialState.get('cards'));
    }

    default:
      return state;
  }
};

export default charactersReducer;
