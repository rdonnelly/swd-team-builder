// DECK ACTIONS

const addCharacterToDeck = (card, isElite) => ({
  type: 'ADD_CARD_TO_DECK',
  payload: {
    card,
    isElite,
  },
});

const removeCharacterFromDeck = card => ({
  type: 'REMOVE_CARD_FROM_DECK',
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


// SETTINGS ACTIONS

const setSetting = (key, value) => ({
  type: 'SET_SETTING',
  payload: {
    key,
    value,
  },
});


// TEAMS ACTIONS

const refineTeams = (deckCards, settings) => ({
  type: 'REFINE_TEAMS',
  payload: {
    deckCards,
    settings,
  },
});

const recalculateTeams = (deckCards, settings) => ({
  type: 'RECALCULATE_TEAMS',
  payload: {
    deckCards,
    settings,
  },
});

const resetTeams = () => ({
  type: 'RESET_TEAMS',
});


// ACTIONS

export const addCharacter = (card, isElite) =>
  (dispatch, getState) => {
    const characterPoints = isElite ?
      card.get('pointsElite') : card.get('pointsRegular');

    if (card.get('isUnique') &&
        getState().deckReducer.get('cards').includes(card)) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/UNIQUE_CHARACTERS' }));
    }

    if (getState().deckReducer.get('points') + characterPoints > 30) {
      return Promise.resolve()
        .then(dispatch({ type: 'ERROR/TOO_MANY_POINTS' }));
    }

    return Promise.resolve()
      .then(dispatch(addCharacterToDeck(card, isElite)))
      .then(dispatch(updateCharacters(getState().deckReducer.get('cards'))))
      .then(dispatch(refineTeams(getState().deckReducer.get('cards'))));
  };

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
        getState().settingsReducer,
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
        getState().settingsReducer,
      )));
