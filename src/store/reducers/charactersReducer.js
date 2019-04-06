import _find from 'lodash/find';
import { characters } from '../../lib/Destiny';

const initialState = {
  characters: Object.values(characters),
  query: '',
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
  ) => charactersToUpdate.filter((characterObject) => {
    const characterAffiliation = characterObject.affiliation;
    const characterDamageTypes = characterObject.damageTypes;
    const characterFaction = characterObject.faction;
    const characterId = characterObject.id;
    const characterName = characterObject.name;
    const characterIsUnique = characterObject.isUnique;
    const characterSet = characterObject.set;

    const hasValidAffiliation =
      validAffiliations[characterAffiliation] &&
      (characterAffiliation === 'neutral' ||
      deckAffiliation === 'neutral' ||
      characterAffiliation === deckAffiliation);
    const hasValidFaction = validFactions[characterFaction];
    const hasValidSet = validSets[characterSet];
    const hasValidDamageTypes =
      characterDamageTypes.every((characterDamageType) => validDamageTypes[characterDamageType]);

    // if character shares a name, isn't the same card as the one in the deck,
    // and is unique
    const hasValidUniqueness = !characterIsUnique ||
      !_find(deckCharacters,
        (deckCharacter) => deckCharacter.id !== characterId &&
          deckCharacter.name === characterName);

    const isCompatible =
      hasValidAffiliation &&
      hasValidDamageTypes &&
      hasValidFaction &&
      hasValidSet &&
      hasValidUniqueness;

    return isCompatible;
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

      return {
        ...state,
        characters:
          updateCharactersCompatibility(
            initialState.characters,
            validAffiliations,
            validDamageTypes,
            validFactions,
            validSets,
            deckAffiliation,
            deckCharacters,
          ),
      };
    }

    case 'UPDATE_CHARACTER_INCLUSION': {
      const {
        excludedCharacterIds,
      } = action.payload;

      return {
        ...state,
        characters:
          state.characters.map((characterObject) => {
            const characterId = characterObject.id;
            const isExcluded = excludedCharacterIds.includes(characterId);

            return {
              ...characterObject,
              isExcluded,
            };
          }),
      };
    }

    case 'RESET_CHARACTERS': {
      const {
        validAffiliations,
        validDamageTypes,
        validFactions,
        validSets,
        deckAffiliation,
      } = action.payload;

      return {
        ...state,
        characters:
          updateCharactersCompatibility(
            initialState.characters,
            validAffiliations,
            validDamageTypes,
            validFactions,
            validSets,
            deckAffiliation,
          ),
      };
    }

    case 'UPDATE_CHARACTER_QUERY': {
      const {
        query,
      } = action.payload;
      return {
        ...state,
        query,
      };
    }

    default:
      return state;
  }
};

export default charactersReducer;
