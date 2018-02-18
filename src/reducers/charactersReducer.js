import _intersection from 'lodash/intersection';
import { characters } from '../lib/Destiny';

const initialState = {
  characters: Object.values(characters),
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

            const characterAffiliation = characterObject.affiliation;
            const characterDamageTypes = characterObject.damageTypes.match(/([IMR]D)/g) || [];
            const characterFaction = characterObject.faction;
            const characterSet = characterObject.set;

            const hasValidAffiliation =
              validAffiliations.indexOf(characterAffiliation) !== -1 &&
              (characterAffiliation === 'neutral' ||
              deckAffiliation === 'neutral' ||
              characterAffiliation === deckAffiliation);
            const hasValidFaction = validFactions.includes(characterFaction);
            const hasValidSet = validSets.includes(characterSet);
            const hasValidDamageTypes =
              characterDamageTypes.length ===
              _intersection(characterDamageTypes, validDamageTypes).length;

            const isIncompatible =
              !hasValidAffiliation || !hasValidDamageTypes || !hasValidFaction || !hasValidSet;

            return Object.assign({}, characterObject, {
              isIncompatible,
            });
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

            const characterId = characterObject.id;
            const isExcluded = excludedCharacterIds.includes(characterId);

            return Object.assign({}, characterObject, {
              isExcluded,
            });
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
