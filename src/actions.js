// DECK ACTIONS

const addCharacterToDeck = card => ({
  type: 'ADD_CHARACTER_TO_DECK',
  payload: {
    card,
  },
});

const removeCharacterFromDeck = card => ({
  type: 'REMOVE_CHARACTER_FROM_DECK',
  payload: {
    card,
  },
});

const setCharacterAnyInDeck = card => ({
  type: 'SET_CHARACTER_ANY_IN_DECK',
  payload: {
    card,
  },
});

const setCharacterRegularInDeck = card => ({
  type: 'SET_CHARACTER_REGULAR_IN_DECK',
  payload: {
    card,
  },
});

const setCharacterEliteInDeck = card => ({
  type: 'SET_CHARACTER_ELITE_IN_DECK',
  payload: {
    card,
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

const recalculateTeams = deckCards => ({
  type: 'RECALCULATE_TEAMS',
  payload: {
    deckCards,
  },
});

const resetTeams = () => ({
  type: 'RESET_TEAMS',
});

const setSetting = (key, value) => ({
  type: 'SET_SETTING',
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

export const addCharacter = card =>
  (dispatch, getState) => {
    if (card.get('isUnique') &&
        getState().deckReducer.get('cards').includes(card)) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/UNIQUE_CHARACTERS' }));
    }

    return Promise.resolve()
      .then(dispatch(addCharacterToDeck(card)))
      .then(dispatch(updateCharacters(getState().deckReducer.get('cards'))))
      .then(dispatch(recalculateTeams(
        getState().deckReducer.get('cards'),
      )));
  };

export const setCharacterAny = card =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterAnyInDeck(card)))
      .then(dispatch(updateCharacters(getState().deckReducer.get('cards'))))
      .then(dispatch(recalculateTeams(getState().deckReducer.get('cards'))));

export const setCharacterRegular = card =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterRegularInDeck(card)))
      .then(dispatch(updateCharacters(getState().deckReducer.get('cards'))))
      .then(dispatch(recalculateTeams(getState().deckReducer.get('cards'))));

export const setCharacterElite = card =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setCharacterEliteInDeck(card)))
      .then(dispatch(updateCharacters(getState().deckReducer.get('cards'))))
      .then(dispatch(recalculateTeams(getState().deckReducer.get('cards'))));

export const removeCharacter = card =>
  (dispatch, getState) => {
    if (!getState().deckReducer.get('cards').some(deckCard => deckCard.get('id') === card.get('id'))) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/NO_CHARACTER' }));
    }

    return Promise.resolve()
      .then(dispatch(removeCharacterFromDeck(card)))
      .then(dispatch(updateCharacters(getState().deckReducer.get('cards'))))
      .then(dispatch(recalculateTeams(
        getState().deckReducer.get('cards'),
      )));
  };

export const reset = () =>
  dispatch =>
    Promise.resolve()
      .then(dispatch(resetDeck()))
      .then(dispatch(resetCharacters()))
      .then(dispatch(resetTeams()));

export const updateSetting = (key, value) =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setSetting(key, value)))
      .then(dispatch(recalculateTeams(
        getState().deckReducer.get('cards'),
      )));

export const updateSort = value =>
  (dispatch, getState) =>
    Promise.resolve()
      .then(dispatch(setSort(value)))
      .then(dispatch(recalculateTeams(
        getState().deckReducer.get('cards'),
      )));
