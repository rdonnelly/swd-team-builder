// DECK ACTIONS

const addCharacterToDeck = characterObject => ({
  type: 'ADD_CHARACTER_TO_DECK',
  payload: {
    characterAffiliation: characterObject.affiliation,
    characterId: characterObject.id,
    characterName: characterObject.name,
  },
});

const removeCharacterFromDeck = characterObject => ({
  type: 'REMOVE_CHARACTER_FROM_DECK',
  payload: {
    characterAffiliation: characterObject.affiliation,
    characterId: characterObject.id,
    characterName: characterObject.name,
  },
});

const setCharacterAnyInDeck = characterObject => ({
  type: 'SET_CHARACTER_ANY_IN_DECK',
  payload: {
    characterAffiliation: characterObject.affiliation,
    characterId: characterObject.id,
    characterName: characterObject.name,
  },
});

const setCharacterRegularInDeck = characterObject => ({
  type: 'SET_CHARACTER_REGULAR_IN_DECK',
  payload: {
    characterAffiliation: characterObject.affiliation,
    characterId: characterObject.id,
    characterName: characterObject.name,
  },
});

const setCharacterEliteInDeck = characterObject => ({
  type: 'SET_CHARACTER_ELITE_IN_DECK',
  payload: {
    characterAffiliation: characterObject.affiliation,
    characterId: characterObject.id,
    characterName: characterObject.name,
  },
});

const includeCharacterInDeck = characterId => ({
  type: 'INCLUDE_CHARACTER',
  payload: {
    characterId,
  },
});

const excludeCharacterInDeck = characterId => ({
  type: 'EXCLUDE_CHARACTER',
  payload: {
    characterId,
  },
});

const resetDeck = () => ({
  type: 'RESET_DECK',
});


// CHARACTER ACTIONS

const updateCharacters = (
  validAffiliations,
  validFactions,
  validDamageTypes,
  validSets,
  deckAffiliation,
  deckCharacters,
) => ({
  type: 'UPDATE_CHARACTERS_COMPATIBILITY',
  payload: {
    validAffiliations,
    validFactions,
    validDamageTypes,
    validSets,
    deckAffiliation,
    deckCharacters,
  },
});

const updateCharacterInclusion = excludedCharacterIds => ({
  type: 'UPDATE_CHARACTER_INCLUSION',
  payload: {
    excludedCharacterIds,
  },
});

const resetCharacters = (
  validAffiliations,
  validFactions,
  validDamageTypes,
  validSets,
  deckAffiliation,
) => ({
  type: 'RESET_CHARACTERS',
  payload: {
    validAffiliations,
    validFactions,
    validDamageTypes,
    validSets,
    deckAffiliation,
  },
});


// TEAMS ACTIONS

const setSetting = (key, value) => ({
  type: 'SET_FILTER',
  payload: {
    key,
    value,
  },
});

const setSort = sortPriority => ({
  type: 'SET_SORT',
  payload: {
    sortPriority,
  },
});


// HELPERS

const resetCharactersHelper = (dispatch, getState) =>
  dispatch(
    resetCharacters(
      getState().teams.settings.filters.affiliations,
      getState().teams.settings.filters.factions,
      getState().teams.settings.filters.damageTypes,
      getState().teams.settings.filters.sets,
      getState().deck.affiliation,
    ),
  );

const updateCharactersHelper = (dispatch, getState) =>
  dispatch(
    updateCharacters(
      getState().teams.settings.filters.affiliations,
      getState().teams.settings.filters.factions,
      getState().teams.settings.filters.damageTypes,
      getState().teams.settings.filters.sets,
      getState().deck.affiliation,
      getState().deck.characters,
    ),
  );


// ACTIONS

export const addCharacter = characterObject =>
  (dispatch, getState) => {
    if (characterObject.isUnique && getState().deck.characters.some(
        deckCharacterObject => deckCharacterObject.id === characterObject.id)) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/UNIQUE_CHARACTERS' }));
    }

    return Promise.resolve()
      .then(dispatch(addCharacterToDeck(characterObject)))
      .then(updateCharactersHelper(dispatch, getState));
  };

export const setCharacterAny = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterAnyInDeck(characterObject)))
      .then(updateCharactersHelper(dispatch, getState));

export const setCharacterRegular = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterRegularInDeck(characterObject)))
      .then(updateCharactersHelper(dispatch, getState));

export const setCharacterElite = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterEliteInDeck(characterObject)))
      .then(updateCharactersHelper(dispatch, getState));

export const removeCharacter = characterObject =>
  (dispatch, getState) => {
    if (!getState().deck.characters.some(
        deckCharacterObject => deckCharacterObject.id === characterObject.id)) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/NO_CHARACTER' }));
    }

    return Promise.resolve()
      .then(dispatch(removeCharacterFromDeck(characterObject)))
      .then(updateCharactersHelper(dispatch, getState));
  };

export const includeCharacter = characterId =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(includeCharacterInDeck(characterId)))
      .then(dispatch(updateCharacterInclusion(getState().deck.excludedCharacterIds)));

export const excludeCharacter = characterId =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(excludeCharacterInDeck(characterId)))
      .then(dispatch(updateCharacterInclusion(getState().deck.excludedCharacterIds)));

export const reset = () =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(resetDeck()))
      .then(dispatch(resetCharactersHelper(dispatch, getState)));

export const updateSetting = (key, value) =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setSetting(key, value)))
      .then(updateCharactersHelper(dispatch, getState));

export const updateSort = value =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(setSort(value)));
