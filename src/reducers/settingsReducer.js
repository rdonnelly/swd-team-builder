import Immutable from 'immutable';


const initialState = Immutable.fromJS({
  minDice: 0,
  maxDice: 4,
});

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SETTING': {
      return state.set(action.payload.key, action.payload.value);
    }

    default:
      return state;
  }
};

export default settingsReducer;
