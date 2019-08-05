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
    validFormats,
    validSets,
    deckAffiliation,
    deckCharacters,
  ) => {
    const deckHasOnlyKylo = deckCharacters.every((deckCharacter) => deckCharacter.name === 'Kylo Ren');
    const deckHasOnlyRey = deckCharacters.every((deckCharacter) => deckCharacter.name === 'Rey');
    return charactersToUpdate.filter((characterObject) => {
      const characterAffiliation = characterObject.affiliation;
      const characterDamageTypes = characterObject.damageTypes;
      const characterFaction = characterObject.faction;
      const characterFormats = characterObject.formats;
      const characterId = characterObject.id;
      const characterName = characterObject.name;
      const characterIsUnique = characterObject.isUnique;
      const characterSet = characterObject.set;

      let hasValidAffiliation =
        validAffiliations[characterAffiliation] &&
        (characterAffiliation === 'neutral' ||
        deckAffiliation === 'neutral' ||
        characterAffiliation === deckAffiliation);

      if (deckHasOnlyKylo && characterObject.name === 'Rey') {
        hasValidAffiliation = true;
      }
      if (deckHasOnlyRey && characterObject.name === 'Kylo Ren') {
        hasValidAffiliation = true;
      }

      const hasValidFaction = validFactions[characterFaction];
      const hasValidSet = validSets[characterSet];
      const hasValidDamageTypes =
        characterDamageTypes.every((characterDamageType) => validDamageTypes[characterDamageType]);
      const hasValidFormats =
        characterFormats.some((characterFormat) => validFormats[characterFormat]);

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
        hasValidFormats &&
        hasValidSet &&
        hasValidUniqueness;

      return isCompatible;
    });
  };

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHARACTERS_COMPATIBILITY': {
      const {
        validAffiliations,
        validDamageTypes,
        validFactions,
        validFormats,
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
            validFormats,
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
          initialState.characters.map((characterObject) => {
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
        validFormats,
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
            validFormats,
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
