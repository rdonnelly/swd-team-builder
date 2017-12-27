import React from 'react';
import { Provider } from 'react-redux';

import App from './screens/App';
import store from './store';


export default function setup() {
  class Root extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
  }

  return Root;
}
