import _without from 'lodash/without';


const initialState = {
  affiliation: 'neutral',
  characters: [],
  excludedCharacterIds: [],
};

const deckReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CHARACTER_TO_DECK': {
      const existingCardIndex = state.characters
        .findIndex(characterObject => characterObject.id === action.payload.characterId);

      if (existingCardIndex !== -1) {
        return {
          ...state,
          characters: state.characters.map((characterObject, index) => {
            if (index !== existingCardIndex) {
              return characterObject;
            }

            return {
              ...characterObject,
              count: characterObject.count + 1,
            };
          }),
        };
      }

      const characterObject = {
        id: action.payload.characterId,
        name: action.payload.characterName,
        affiliation: action.payload.characterAffiliation,
        numDice: 0,
        count: 1,
      };

      return {
        ...state,
        affiliation: state.affiliation === 'neutral' ? action.payload.characterAffiliation : state.affiliation,
        characters: [
          ...state.characters,
          characterObject,
        ],
      };
    }

    case 'SET_CHARACTER_ANY_IN_DECK': {
      const existingCardIndex = state.characters
        .findIndex(characterObject => characterObject.id === action.payload.characterId);

      if (existingCardIndex === -1) {
        return state;
      }

      return {
        ...state,
        characters: state.characters.map((characterObject, index) => {
          if (index !== existingCardIndex) {
            return characterObject;
          }

          return {
            ...characterObject,
            numDice: 0,
          };
        }),
      };
    }

    case 'SET_CHARACTER_REGULAR_IN_DECK': {
      const existingCardIndex = state.characters
        .findIndex(characterObject => characterObject.id === action.payload.characterId);

      if (existingCardIndex === -1) {
        return state;
      }

      return {
        ...state,
        characters: state.characters.map((characterObject, index) => {
          if (index !== existingCardIndex) {
            return characterObject;
          }

          return {
            ...characterObject,
            numDice: 1,
          };
        }),
      };
    }

    case 'SET_CHARACTER_ELITE_IN_DECK': {
      const existingCardIndex = state.characters
        .findIndex(characterObject => characterObject.id === action.payload.characterId);

      if (existingCardIndex === -1) {
        return state;
      }

      return {
        ...state,
        characters: state.characters.map((characterObject, index) => {
          if (index !== existingCardIndex) {
            return characterObject;
          }

          return {
            ...characterObject,
            numDice: 2,
          };
        }),
      };
    }

    case 'REMOVE_CHARACTER_FROM_DECK': {
      const existingCardIndex = state.characters
        .findIndex(characterObject => characterObject.id === action.payload.characterId);

      if (existingCardIndex === -1) {
        return state;
      }

      let affiliation = 'neutral';

      const characters = state.characters.reduce((array, characterObject, index) => {
        if (index === existingCardIndex) {
          if (characterObject.count > 1) {
            array.push({
              ...characterObject,
              count: characterObject.count - 1,
            });

            if (characterObject.affiliation !== 'neutral') {
              affiliation = characterObject.affiliation;
            }
          }
        } else {
          array.push({
            ...characterObject,
          });

          if (characterObject.affiliation !== 'neutral') {
            affiliation = characterObject.affiliation;
          }
        }

        return array;
      }, []);

      return {
        ...state,
        characters,
        affiliation,
      };
    }

    case 'INCLUDE_CHARACTER': {
      const existingIndex = state.excludedCharacterIds
        .findIndex(excludedCharacterId => excludedCharacterId === action.payload.characterId);

      if (existingIndex !== -1) {
        return {
          ...state,
          excludedCharacterIds: _without(state.excludedCharacterIds, action.payload.characterId),
        };
      }

      return state;
    }

    case 'EXCLUDE_CHARACTER': {
      const existingIndex = state.excludedCharacterIds
        .findIndex(excludedCharacterId => excludedCharacterId === action.payload.characterId);

      if (existingIndex === -1) {
        return {
          ...state,
          excludedCharacterIds: [...state.excludedCharacterIds, action.payload.characterId],
        };
      }

      return state;
    }

    case 'RESET_DECK': {
      return {
        ...state,
        affiliation: 'neutral',
        characters: [],
      };
    }

    default:
      return state;
  }
};

export default deckReducer;
