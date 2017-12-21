import Immutable from 'immutable';

import { characterCards } from '../lib/Destiny';

const affiliationOrder = Immutable.fromJS({
  villain: 0,
  hero: 1,
  neutral: 2,
});

const factionOrder = Immutable.fromJS({
  red: 0,
  blue: 1,
  yellow: 2,
});


const characters = characterCards
  .sort((a, b) => {
    if (a.affiliation !== b.affiliation) {
      return affiliationOrder.get(a.affiliation) - affiliationOrder.get(b.affiliation);
    }

    if (a.faction !== b.faction) {
      return factionOrder.get(a.faction) - factionOrder.get(b.faction);
    }

    if (a.isUnique !== b.isUnique) {
      return a.isUnique ? -1 : 1;
    }

    if (a.name !== b.name) {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : 1;
    }

    return 0;
  })
  .map(card => ({
    id: card.id,
    name: card.name,
    set: card.set,
    affiliation: card.affiliation,
    faction: card.faction,
    isCompatibile: true,
  }));

const initialState = Immutable.fromJS(characters);

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHARACTERS': {
      return state.map((characterObject) => {
        const {
          validAffiliations,
          validFactions,
          validSets,
          deckAffiliation,
        } = action.payload;

        const characterAffiliation = characterObject.get('affiliation');
        const characterFaction = characterObject.get('faction');
        const characterSet = characterObject.get('set');

        const hasValidAffiliation =
          validAffiliations.indexOf(characterAffiliation) !== -1 &&
          (characterAffiliation === 'neutral' ||
          deckAffiliation === 'neutral' ||
          characterAffiliation === deckAffiliation);
        const hasValidFaction = validFactions.includes(characterFaction);
        const hasValidSet = validSets.includes(characterSet);
        return characterObject.set('isCompatibile',
          hasValidAffiliation && hasValidFaction && hasValidSet);
      })
        ;
    }

    case 'RESET_CHARACTERS': {
      return initialState;
    }

    default:
      return state;
  }
};

export default charactersReducer;
