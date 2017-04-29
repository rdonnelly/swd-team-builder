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

const updateTeams = (card, deckCards) => ({
  type: 'UPDATE_TEAMS',
  payload: {
    card,
    deckCards,
  },
});
const refreshTeams = (card, deckCards) => ({
  type: 'REFRESH_TEAMS',
  payload: {
    card,
    deckCards,
  },
});

export const addCharacter = (card, isElite) =>
  (dispatch, getState) => {
    const characterPoints = isElite ?
      card.get('pointsElite') : card.get('pointsRegular');

    if (card.get('isUnique') &&
        getState().deckReducer.get('cards').includes(card)) {
      return Promise.resolve().then(dispatch({ type: 'ERROR/UNIQUE_CHARACTERS' }));
    }

    if (getState().deckReducer.get('points') + characterPoints > 30) {
      return Promise.resolve().then(dispatch({ type: 'ERROR/TOO_MANY_POINTS' }));
    }

    return Promise.resolve()
      .then(dispatch(addCharacterToDeck(card, isElite)))
      .then(dispatch(updateTeams(card, getState().deckReducer.get('cards'))));
  };

export const removeCharacter = card =>
  (dispatch, getState) => {
    if (!getState().deckReducer.get('cards').some(deckCard => deckCard.get('id') === card.get('id'))) {
      return Promise.resolve().then(dispatch({ type: 'ERROR/NO_CHARACTER' }));
    }

    return Promise.resolve()
      .then(dispatch(removeCharacterFromDeck(card)))
      .then(dispatch(refreshTeams(card, getState().deckReducer.get('cards'))));
  };
