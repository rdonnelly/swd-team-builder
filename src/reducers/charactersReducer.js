import Immutable from 'immutable';

import { characters } from '../lib/Destiny';

const initialState = Immutable.fromJS(
  Object.values(characters).map(card => Object.assign({}, card, { isCompatibile: true })),
);

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHARACTERS': {
      return state.map((characterObject) => {
        const {
          validAffiliations,
          validDamageTypes,
          validFactions,
          validSets,
          deckAffiliation,
        } = action.payload;

        const characterAffiliation = characterObject.get('affiliation');
        const characterDamageTypes = characterObject.get('damageTypes');
        const characterFaction = characterObject.get('faction');
        const characterSet = characterObject.get('set');

        const hasValidAffiliation =
          validAffiliations.indexOf(characterAffiliation) !== -1 &&
          (characterAffiliation === 'neutral' ||
          deckAffiliation === 'neutral' ||
          characterAffiliation === deckAffiliation);
        const hasValidFaction = validFactions.includes(characterFaction);
        const hasValidSet = validSets.includes(characterSet);
        const hasValidDamageTypes = characterDamageTypes.isSubset(validDamageTypes);
        return characterObject.set('isCompatibile',
          hasValidAffiliation && hasValidDamageTypes && hasValidFaction && hasValidSet);
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
