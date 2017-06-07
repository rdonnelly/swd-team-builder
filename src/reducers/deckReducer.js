import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  cards: [],
});

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CHARACTER_TO_DECK': {
      const existingCardIndex = state.get('cards')
        .findIndex(card => card.get('id') === action.payload.card.get('id'));

      const characterCount = 1 + (existingCardIndex !== -1 ? state.get('cards').get(existingCardIndex).get('count') : 0);

      const cardObj = Immutable.fromJS({
        id: action.payload.card.get('id'),
        name: action.payload.card.get('name'),
        isElite: null,
        count: characterCount,
      });

      if (existingCardIndex !== -1) {
        return state.update('cards', cards => cards.set(existingCardIndex, cardObj));
      }

      return state.update('cards', cards => cards.push(cardObj));
    }

    case 'SET_CHARACTER_ANY_IN_DECK': {
      const existingCardIndex = state.get('cards')
        .findIndex(card => card.get('id') === action.payload.card.get('id'));

      const cardObj = state.get('cards').get(existingCardIndex)
        .set('isElite', null);

      return state.update('cards', cards => cards.set(existingCardIndex, cardObj));
    }

    case 'SET_CHARACTER_REGULAR_IN_DECK': {
      const existingCardIndex = state.get('cards')
        .findIndex(card => card.get('id') === action.payload.card.get('id'));

      const cardObj = state.get('cards').get(existingCardIndex)
        .set('isElite', false);

      return state.update('cards', cards => cards.set(existingCardIndex, cardObj));
    }

    case 'SET_CHARACTER_ELITE_IN_DECK': {
      const existingCardIndex = state.get('cards')
        .findIndex(card => card.get('id') === action.payload.card.get('id'));

      const cardObj = state.get('cards').get(existingCardIndex)
        .set('isElite', true);

      return state.update('cards', cards => cards.set(existingCardIndex, cardObj));
    }

    case 'REMOVE_CHARACTER_FROM_DECK': {
      return state.update('cards', cards => cards.filter(card => card.get('id') !== action.payload.card.get('id')));
    }

    case 'RESET_DECK': {
      return state.set('cards', initialState.get('cards'));
    }

    default:
      return state;
  }
};

export default deckReducer;
