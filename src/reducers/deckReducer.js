import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  characters: [],
});

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CHARACTER_TO_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(card => card.get('id') === action.payload.card.id);

      if (existingCardIndex !== -1) {
        return state.update('characters', characterObjects =>
          characterObjects.update(existingCardIndex, characterObject =>
            characterObject.update('count', count => count + 1)));
      }

      const characterObject = Immutable.fromJS({
        id: action.payload.card.id,
        name: action.payload.card.name,
        isElite: null,
        count: 1,
      });

      return state.update('characters', cards => cards.push(characterObject));
    }

    case 'SET_CHARACTER_ANY_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(card => card.get('id') === action.payload.card.id);

      return state.update('characters', characterObjects =>
        characterObjects.update(existingCardIndex, characterObject =>
          characterObject.set('isElite', null)));
    }

    case 'SET_CHARACTER_REGULAR_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(card => card.get('id') === action.payload.card.id);

      return state.update('characters', characterObjects =>
        characterObjects.update(existingCardIndex, characterObject =>
          characterObject.set('isElite', false)));
    }

    case 'SET_CHARACTER_ELITE_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(card => card.get('id') === action.payload.card.id);

      return state.update('characters', characterObjects =>
        characterObjects.update(existingCardIndex, characterObject =>
          characterObject.set('isElite', true)));
    }

    case 'REMOVE_CHARACTER_FROM_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(card => card.get('id') === action.payload.card.id);

      let characterCount = -1;
      if (existingCardIndex !== -1) {
        characterCount += state.get('characters').get(existingCardIndex).get('count');
      }

      if (characterCount <= 0) {
        return state.update('characters', characterObjects => characterObjects.delete(existingCardIndex));
      }

      return state.update('characters', characterObjects =>
        characterObjects.update(existingCardIndex, characterObject =>
          characterObject.set('count', characterCount)));
    }

    case 'RESET_DECK': {
      return state.set('characters', initialState.get('characters'));
    }

    default:
      return state;
  }
};

export default deckReducer;
