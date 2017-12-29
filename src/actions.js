// DECK ACTIONS

const addCharacterToDeck = characterObject => ({
  type: 'ADD_CHARACTER_TO_DECK',
  payload: {
    characterAffiliation: characterObject.get('affiliation'),
    characterId: characterObject.get('id'),
    characterName: characterObject.get('name'),
  },
});

const removeCharacterFromDeck = characterObject => ({
  type: 'REMOVE_CHARACTER_FROM_DECK',
  payload: {
    characterAffiliation: characterObject.get('affiliation'),
    characterId: characterObject.get('id'),
    characterName: characterObject.get('name'),
  },
});

const setCharacterAnyInDeck = characterObject => ({
  type: 'SET_CHARACTER_ANY_IN_DECK',
  payload: {
    characterAffiliation: characterObject.get('affiliation'),
    characterId: characterObject.get('id'),
    characterName: characterObject.get('name'),
  },
});

const setCharacterRegularInDeck = characterObject => ({
  type: 'SET_CHARACTER_REGULAR_IN_DECK',
  payload: {
    characterAffiliation: characterObject.get('affiliation'),
    characterId: characterObject.get('id'),
    characterName: characterObject.get('name'),
  },
});

const setCharacterEliteInDeck = characterObject => ({
  type: 'SET_CHARACTER_ELITE_IN_DECK',
  payload: {
    characterAffiliation: characterObject.get('affiliation'),
    characterId: characterObject.get('id'),
    characterName: characterObject.get('name'),
  },
});

const includeCharacterInDeck = characterObject => ({
  type: 'INCLUDE_CHARACTER',
  payload: {
    characterId: characterObject.get('id'),
  },
});

const excludeCharacterInDeck = characterObject => ({
  type: 'EXCLUDE_CHARACTER',
  payload: {
    characterId: characterObject.get('id'),
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
) => ({
  type: 'UPDATE_CHARACTERS_COMPATIBILITY',
  payload: {
    validAffiliations,
    validFactions,
    validDamageTypes,
    validSets,
    deckAffiliation,
  },
});

const updateCharacterInclusion = excludedCharacterIds => ({
  type: 'UPDATE_CHARACTER_INCLUSION',
  payload: {
    excludedCharacterIds,
  },
});

const resetCharacters = () => ({
  type: 'RESET_CHARACTERS',
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

const updateCharacterHelper = (dispatch, getState) =>
  dispatch(
    updateCharacters(
      getState().teams.settings.getIn(['filters', 'affiliations']),
      getState().teams.settings.getIn(['filters', 'factions']),
      getState().teams.settings.getIn(['filters', 'damageTypes']),
      getState().teams.settings.getIn(['filters', 'sets']),
      getState().deck.get('affiliation'),
    ),
  );


// ACTIONS

export const addCharacter = characterObject =>
  (dispatch, getState) => {
    if (characterObject.get('isUnique') &&
        getState().deck.get('characters').includes(characterObject)) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/UNIQUE_CHARACTERS' }));
    }

    return Promise.resolve()
      .then(dispatch(addCharacterToDeck(characterObject)))
      .then(updateCharacterHelper(dispatch, getState));
  };

export const setCharacterAny = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterAnyInDeck(characterObject)))
      .then(updateCharacterHelper(dispatch, getState));

export const setCharacterRegular = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterRegularInDeck(characterObject)))
      .then(updateCharacterHelper(dispatch, getState));

export const setCharacterElite = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterEliteInDeck(characterObject)))
      .then(updateCharacterHelper(dispatch, getState));

export const removeCharacter = characterObject =>
  (dispatch, getState) => {
    if (!getState().deck.get('characters').some(deckCard => deckCard.get('id') === characterObject.get('id'))) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/NO_CHARACTER' }));
    }

    return Promise.resolve()
      .then(dispatch(removeCharacterFromDeck(characterObject)))
      .then(updateCharacterHelper(dispatch, getState));
  };

export const includeCharacter = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(includeCharacterInDeck(characterObject)))
      .then(dispatch(updateCharacterInclusion(getState().deck.get('excludedCharacterIds'))));

export const excludeCharacter = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(excludeCharacterInDeck(characterObject)))
      .then(dispatch(updateCharacterInclusion(getState().deck.get('excludedCharacterIds'))));

export const reset = () =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(resetDeck()))
      .then(dispatch(resetCharacters()));

export const updateSetting = (key, value) =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setSetting(key, value)))
      .then(updateCharacterHelper(dispatch, getState));

export const updateSort = value =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(setSort(value)));
