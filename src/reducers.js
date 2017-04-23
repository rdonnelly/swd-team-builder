import Immutable from 'immutable';

import { cards } from './lib/Destiny';


const initialState = Immutable.fromJS({
  cards: [],
  points: 0,
});

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CARD': {
      if (state.get('cards').indexOf(action.payload.id) !== -1) {
        return state;
      }

      const card = cards.get(action.payload.id);

      return state
        .update('cards', deckCards => deckCards.push(action.payload.id))
        .update('points', points => points + card.get('points')[0]);
    }

    case 'REMOVE_CARD': {
      if (state.get('cards').indexOf(action.payload.id) === -1) {
        return state;
      }

      const card = cards.get(action.payload.id);

      return state
        .update('cards', deckCards => deckCards.filter(cardId => cardId === action.payload.id))
        .update('points', points => points - card.get('points')[0]);
    }

    default:
      return state;
  }
};

export {
  deckReducer,
};
