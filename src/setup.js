import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import App from './screens/App';
import configureStore from './store/configureStore';


export default function setup() {
  class AppContainer extends Component {
    componentDidMount() {
      setTimeout(() => {
        StatusBar.setBarStyle('light-content');
      }, 500);
    }

    render() {
      return (
        <Provider store={ configureStore() }>
          <App />
        </Provider>
      );
    }
  }

  return AppContainer;
}
