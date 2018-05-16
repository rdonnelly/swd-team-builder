import ReduxThunk from 'redux-thunk';
import {
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import { applyMiddleware, createStore } from 'redux';
// import { createLogger } from 'redux-logger';

import rootReducer from './reducers/rootReducer';


export default function configureStore(initialState = {}) {
  const rootNavigationMiddleware = createReactNavigationReduxMiddleware(
    'tabNavigation',
    state => state.tabNavigation,
  );

  // ENHANCER / MIDDLEWARE
  const middleware = [
    rootNavigationMiddleware,
    ReduxThunk,

    // eslint-disable-next-line no-undef
    // __DEV__ && createLogger(),

    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ].filter(Boolean);

  const enhancer = applyMiddleware(...middleware);

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  );

  // FIX HOT RELOADING
  if (module.hot) {
    module.hot.accept(() => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('./reducers/rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
