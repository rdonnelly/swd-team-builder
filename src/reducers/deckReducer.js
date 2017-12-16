import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  affiliation: 'neutral',
  characters: [],
});

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CHARACTER_TO_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      if (existingCardIndex !== -1) {
        return state.updateIn(['characters', existingCardIndex, 'count'], count => count + 1);
      }

      const characterObject = Immutable.fromJS({
        id: action.payload.characterObject.get('id'),
        name: action.payload.characterObject.get('name'),
        affiliation: action.payload.characterObject.get('affiliation'),
        numDice: 0,
        count: 1,
      });

      return state
        .update('affiliation',
          affiliation => (affiliation === 'neutral' ? action.payload.characterObject.get('affiliation') : affiliation))
        .update('characters', cards => cards.push(characterObject));
    }

    case 'SET_CHARACTER_ANY_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      return state.setIn(['characters', existingCardIndex, 'numDice'], 0);
    }

    case 'SET_CHARACTER_REGULAR_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      return state.setIn(['characters', existingCardIndex, 'numDice'], 1);
    }

    case 'SET_CHARACTER_ELITE_IN_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      return state.setIn(['characters', existingCardIndex, 'numDice'], 2);
    }

    case 'REMOVE_CHARACTER_FROM_DECK': {
      const existingCardIndex = state.get('characters')
        .findIndex(characterObject => characterObject.get('id') === action.payload.characterObject.get('id'));

      if (existingCardIndex === -1) {
        return state.characters;
      }

      return state
        .update('characters', (characterObjects) => {
          const existingDeckCharacterObject = characterObjects.get(existingCardIndex);
          if (existingDeckCharacterObject.get('count') > 1) {
            return characterObjects.updateIn([existingCardIndex, 'count'], count => count - 1);
          }

          return characterObjects.delete(existingCardIndex);
        })
        .update('affiliation', (affiliation) => {
          if (affiliation === 'neutral') {
            return 'neutral';
          }

          let newAffiliation = 'neutral';
          state.get('characters').every((characterObject, index) => {
            const characterAffiliation = characterObject.get('affiliation');
            if (index === existingCardIndex) {
              return true;
            }

            if (characterAffiliation === 'neutral') {
              return true;
            }

            if (characterAffiliation !== 'neutral') {
              newAffiliation = characterAffiliation;
              return false;
            }

            return true;
          });

          return newAffiliation;
        });
    }

    case 'RESET_DECK': {
      return state
        .set('affiliation', initialState.get('affiliation'))
        .set('characters', initialState.get('characters'));
    }

    default:
      return state;
  }
};

export default deckReducer;
