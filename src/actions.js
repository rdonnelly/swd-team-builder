// DECK ACTIONS

const addCharacterToDeck = characterObject => ({
  type: 'ADD_CHARACTER_TO_DECK',
  payload: {
    characterObject,
  },
});

const removeCharacterFromDeck = characterObject => ({
  type: 'REMOVE_CHARACTER_FROM_DECK',
  payload: {
    characterObject,
  },
});

const setCharacterAnyInDeck = characterObject => ({
  type: 'SET_CHARACTER_ANY_IN_DECK',
  payload: {
    characterObject,
  },
});

const setCharacterRegularInDeck = characterObject => ({
  type: 'SET_CHARACTER_REGULAR_IN_DECK',
  payload: {
    characterObject,
  },
});

const setCharacterEliteInDeck = characterObject => ({
  type: 'SET_CHARACTER_ELITE_IN_DECK',
  payload: {
    characterObject,
  },
});

const resetDeck = () => ({
  type: 'RESET_DECK',
});


// CHARACTER ACTIONS

const updateCharacters = deckCards => ({
  type: 'UPDATE_CHARACTERS',
  payload: {
    deckCards,
  },
});

const resetCharacters = () => ({
  type: 'RESET_CHARACTERS',
});


// TEAMS ACTIONS

const setSetting = (key, value) => ({
  type: 'SET_SETTING',
  payload: {
    key,
    value,
  },
});

const setSettingDamageTypes = (key, value) => ({
  type: 'SET_SETTING_DAMAGE_TYPES',
  payload: {
    key,
    value,
  },
});

const setSettingSets = (key, value) => ({
  type: 'SET_SETTING_SETS',
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


// ACTIONS

export const addCharacter = characterObject =>
  (dispatch, getState) => {
    if (characterObject.isUnique &&
        getState().deck.get('characters').includes(characterObject)) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/UNIQUE_CHARACTERS' }));
    }

    return Promise.resolve()
      .then(dispatch(addCharacterToDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('characters'))));
  };

export const setCharacterAny = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterAnyInDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('characters'))));

export const setCharacterRegular = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterRegularInDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('characters'))));

export const setCharacterElite = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterEliteInDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('characters'))));

export const removeCharacter = characterObject =>
  (dispatch, getState) => {
    if (!getState().deck.get('characters').some(deckCard => deckCard.get('id') === characterObject.get('id'))) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/NO_CHARACTER' }));
    }

    return Promise.resolve()
      .then(dispatch(removeCharacterFromDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('characters'))));
  };

export const reset = () =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(resetDeck()))
      .then(dispatch(resetCharacters()));

export const updateSetting = (key, value) =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(setSetting(key, value)));

export const updateSettingDamageTypes = (key, value) =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(setSettingDamageTypes(key, value)));

export const updateSettingSets = (key, value) =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(setSettingSets(key, value)));

export const updateSort = value =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(setSort(value)));
