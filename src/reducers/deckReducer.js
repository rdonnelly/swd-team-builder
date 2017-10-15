import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  characters: [],
});

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CHARACTER_TO_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      if (existingCardIndex !== -1) {
        return state.update('characters', characterObjects =>
          characterObjects.update(existingCardIndex, characterObject =>
            characterObject.update('count', count => count + 1)));
      }

      const characterObject = Immutable.fromJS({
        id: action.payload.characterObject.get('id'),
        name: action.payload.characterObject.get('name'),
        numDice: 0,
        count: 1,
      });

      return state.update('characters', cards => cards.push(characterObject));
    }

    case 'SET_CHARACTER_ANY_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      return state.update('characters', characterObjects =>
        characterObjects.update(existingCardIndex, characterObject =>
          characterObject.set('numDice', 0)));
    }

    case 'SET_CHARACTER_REGULAR_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      return state.update('characters', characterObjects =>
        characterObjects.update(existingCardIndex, characterObject =>
          characterObject.set('numDice', 1)));
    }

    case 'SET_CHARACTER_ELITE_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      return state.update('characters', characterObjects =>
        characterObjects.update(existingCardIndex, characterObject =>
          characterObject.set('numDice', 2)));
    }

    case 'REMOVE_CHARACTER_FROM_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      if (existingCardIndex === -1) {
        return state.characters;
      }

      return state.update('characters', (characterObjects) => {
        const existingDeckCharacterObject = characterObjects.get(existingCardIndex);
        if (existingDeckCharacterObject.get('count') > 1) {
          return characterObjects.update(existingCardIndex, characterObject =>
            characterObject.update('count', count => count - 1));
        }

        return characterObjects.delete(existingCardIndex);
      });
    }

    case 'RESET_DECK': {
      return state.set('characters', initialState.get('characters'));
    }

    default:
      return state;
  }
};

export default deckReducer;
