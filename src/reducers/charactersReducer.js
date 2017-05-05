import Immutable from 'immutable';

import * as Destiny from '../lib/Destiny';


const initialState = Immutable.fromJS({
  cards: Destiny.cards
    .filter(card => card.get('type') === 'character')
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
      return state.update('cards', characterCards =>
        characterCards.map(characterCard =>
          characterCard
            .set('inDeck', action.payload.deckCards.some(deckCard => deckCard.get('id') === characterCard.get('id')))
            .set('isCompatibile',
              action.payload.deckCards.every(
                deckCard =>
                  Destiny.cards.get(deckCard.get('id')).affiliation ===
                  Destiny.cards.get(characterCard.get('id')).affiliation)),
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
