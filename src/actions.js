export const addCharacterToDeck = (card, isElite) => ({
  type: 'ADD_CARD_TO_DECK',
  payload: {
    card,
    isElite,
  },
});

export const updateTeams = (card, isElite) => ({
  type: 'UPDATE_TEAMS',
  payload: {
    card,
    isElite,
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
      .then(dispatch(updateTeams(card, isElite)));
  };
