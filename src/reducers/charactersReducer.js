import Immutable from 'immutable';

import { characters } from '../lib/Destiny';

const initialState = {
  characters: Immutable.fromJS(Object.values(characters)),
};

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHARACTERS_COMPATIBILITY': {
      return Object.assign({}, state, {
        characters:
          state.characters.map((characterObject) => {
            const {
              validAffiliations,
              validDamageTypes,
              validFactions,
              validSets,
              deckAffiliation,
            } = action.payload;

            const characterAffiliation = characterObject.get('affiliation');
            const characterDamageTypes = Immutable.fromJS(characterObject.get('damageTypes').match(/([IMR]D)/g) || []);
            const characterFaction = characterObject.get('faction');
            const characterSet = characterObject.get('set');

            const hasValidAffiliation =
              validAffiliations.indexOf(characterAffiliation) !== -1 &&
              (characterAffiliation === 'neutral' ||
              deckAffiliation === 'neutral' ||
              characterAffiliation === deckAffiliation);
            const hasValidFaction = validFactions.includes(characterFaction);
            const hasValidSet = validSets.includes(characterSet);
            const hasValidDamageTypes = characterDamageTypes.isSubset(validDamageTypes);
            return characterObject.set('isIncompatible',
              !hasValidAffiliation || !hasValidDamageTypes || !hasValidFaction || !hasValidSet);
          }),
      });
    }

    case 'UPDATE_CHARACTER_INCLUSION': {
      return Object.assign({}, state, {
        characters:
          state.characters.map((characterObject) => {
            const {
              excludedCharacterIds,
            } = action.payload;

            const characterId = characterObject.get('id');
            const isExcluded = excludedCharacterIds.includes(characterId);

            return characterObject.set('isExcluded', isExcluded);
          }),
      });
    }

    case 'RESET_CHARACTERS': {
      return initialState;
    }

    default:
      return state;
  }
};

export default charactersReducer;
