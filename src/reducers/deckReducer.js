import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  cards: [],
  points: 0,
});

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CARD_TO_DECK': {
      const characterPoints = action.payload.isElite ?
        action.payload.card.get('pointsElite') : action.payload.card.get('pointsRegular');

      return state
        .update('cards', deckCards => deckCards.push(action.payload.card))
        .update('points', points => points + characterPoints);
    }

    case 'REMOVE_CARD_FROM_DECK': {
      if (state.get('cards').indexOf(action.payload.card) === -1) {
        return state;
      }

      const characterPoints = action.payload.isElite ?
        action.payload.card.get('pointsElite') : action.payload.card.get('pointsRegular');

      return state
        .update('cards', deckCards => deckCards.filter(
          deckCard => deckCard.get('id') === action.payload.card.get('id')))
        .update('points', points => points - characterPoints);
    }

    default:
      return state;
  }
};

export default deckReducer;
