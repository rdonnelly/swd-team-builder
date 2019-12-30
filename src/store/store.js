import { applyMiddleware, createStore } from 'redux';
// import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';

import rootReducer from './reducers/rootReducer';

const configureStore = (initialState = {}) => {
  // ENHANCER / MIDDLEWARE
  const middleware = [
    reduxThunk,

    // __DEV__ && createLogger(),

    // __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
  ].filter(Boolean);

  const enhancer = applyMiddleware(...middleware);

  const store = createStore(rootReducer, initialState, enhancer);

  // FIX HOT RELOADING FOR REDUX
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

const store = configureStore();

export default store;
