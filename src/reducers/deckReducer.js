import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  cards: [],
  points: 0,
});

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CARD_TO_DECK': {
      const existingCardIndex = state.get('cards')
        .findKey(card => card.get('id') === action.payload.card.get('id'));

      const cardObj = Immutable.fromJS({
        id: action.payload.card.get('id'),
        name: action.payload.card.get('name'),
        isElite: action.payload.isElite,
        count: 1 + (existingCardIndex !== undefined ? state.get('cards').get(existingCardIndex).get('count') : 0),
      });

      const characterPoints = action.payload.isElite ?
        action.payload.card.get('pointsElite') : action.payload.card.get('pointsRegular');

      const newState = state.update('points', points => points + characterPoints);

      if (existingCardIndex !== undefined) {
        return newState.update('cards', cards => cards.set(existingCardIndex, cardObj));
      }

      return newState.update('cards', cards => cards.push(cardObj));
    }

    case 'REMOVE_CARD_FROM_DECK': {
      const existingCardIndex = state.get('cards')
        .findKey(card => card.get('id') === action.payload.card.get('id'));

      if (existingCardIndex === undefined) {
        return state;
      }

      const existingCard = state.get('cards').get(existingCardIndex);
      const existingCardPoints = existingCard.get('isElite') ?
        action.payload.card.get('pointsElite') : action.payload.card.get('pointsRegular');


      if (existingCard.get('count') === 1) {
        return state.update('points', points => points - existingCardPoints)
          .update('cards', cards => cards.delete(existingCardIndex));
      }

      const cardObj = Immutable.fromJS({
        id: action.payload.card.get('id'),
        name: action.payload.card.get('name'),
        isElite: action.payload.isElite,
        count: existingCard.get('count') - 1,
      });

      return state.update('points', points => points - existingCardPoints)
        .update('cards', cards => cards.set(existingCardIndex, cardObj));
    }

    case 'RESET_DECK': {
      return state.set('points', initialState.get('points'))
        .set('cards', initialState.get('cards'));
    }

    default:
      return state;
  }
};

export default deckReducer;
