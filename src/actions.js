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

const updateCharacters = (deckAffiliation, sets) => ({
  type: 'UPDATE_CHARACTERS',
  payload: {
    deckAffiliation,
    sets,
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
      .then(dispatch(updateCharacters(getState().deck.get('affiliation'), getState().teams.settings.getIn(['filters', 'sets']))));
  };

export const setCharacterAny = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterAnyInDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('affiliation'), getState().teams.settings.getIn(['filters', 'sets']))));

export const setCharacterRegular = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterRegularInDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('affiliation'), getState().teams.settings.getIn(['filters', 'sets']))));

export const setCharacterElite = characterObject =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterEliteInDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('affiliation'), getState().teams.settings.getIn(['filters', 'sets']))));

export const removeCharacter = characterObject =>
  (dispatch, getState) => {
    if (!getState().deck.get('characters').some(deckCard => deckCard.get('id') === characterObject.get('id'))) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/NO_CHARACTER' }));
    }

    return Promise.resolve()
      .then(dispatch(removeCharacterFromDeck(characterObject)))
      .then(dispatch(updateCharacters(getState().deck.get('affiliation'), getState().teams.settings.getIn(['filters', 'sets']))));
  };

export const reset = () =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(resetDeck()))
      .then(dispatch(resetCharacters()));

export const updateSetting = (key, value) =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setSetting(key, value)))
      .then(dispatch(updateCharacters(getState().deck.get('affiliation'), getState().teams.settings.getIn(['filters', 'sets']))));

export const updateSort = value =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(setSort(value)));
