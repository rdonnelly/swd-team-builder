import _find from 'lodash/find';
import _intersection from 'lodash/intersection';
import { characters } from '../lib/Destiny';

const initialState = {
  characters: Object.values(characters),
};

const updateCharactersCompatibility =
  (
    charactersToUpdate,
    validAffiliations,
    validDamageTypes,
    validFactions,
    validSets,
    deckAffiliation,
    deckCharacters,
  ) =>
    charactersToUpdate.map((characterObject) => {
      const characterAffiliation = characterObject.affiliation;
      const characterDamageTypes = characterObject.damageTypes;
      const characterFaction = characterObject.faction;
      const characterId = characterObject.id;
      const characterName = characterObject.name;
      const characterIsUnique = characterObject.isUnique;
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

      // if character shares a name, isn't the same card as the one in the deck,
      // and is unique
      const hasValidUniqueness = !characterIsUnique ||
        !_find(deckCharacters,
          deckCharacter =>
            deckCharacter.id !== characterId && deckCharacter.name === characterName);

      const isIncompatible =
        !hasValidAffiliation ||
        !hasValidDamageTypes ||
        !hasValidFaction ||
        !hasValidSet ||
        !hasValidUniqueness;

      return Object.assign({}, characterObject, {
        isIncompatible,
      });
    });

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHARACTERS_COMPATIBILITY': {
      const {
        validAffiliations,
        validDamageTypes,
        validFactions,
        validSets,
        deckAffiliation,
        deckCharacters,
      } = action.payload;

      return Object.assign({}, state, {
        characters:
          updateCharactersCompatibility(
            state.characters,
            validAffiliations,
            validDamageTypes,
            validFactions,
            validSets,
            deckAffiliation,
            deckCharacters,
          ),
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
      const {
        validAffiliations,
        validDamageTypes,
        validFactions,
        validSets,
        deckAffiliation,
      } = action.payload;

      return Object.assign({}, state, {
        characters:
          updateCharactersCompatibility(
            initialState.characters,
            validAffiliations,
            validDamageTypes,
            validFactions,
            validSets,
            deckAffiliation,
          ),
      });
    }

    default:
      return state;
  }
};

export default charactersReducer;
