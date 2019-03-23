import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
// import SQLite from 'react-native-sqlite-storage';

import App from './screens/App';
import store from './store/store';
import connectDatabase from './components/connectDatabase';


export default function setup() {
  class AppContainer extends Component {
    componentDidMount() {
      setTimeout(() => {
        StatusBar.setBarStyle('light-content');
      }, 500);
    }

    render() {
      return (
        <Provider store={ store }>
          <App />
        </Provider>
      );
    }
  }

  return connectDatabase(AppContainer);
}
