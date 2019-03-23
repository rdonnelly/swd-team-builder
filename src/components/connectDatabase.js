import React, { Component } from 'react';
import { AppState } from 'react-native';

import database from '../lib/Database';


function connectDatabase(WrappedComponent) {
  return class ConnectDatabaseHoc extends Component {
    constructor(props) {
      super(props);
      this.state = {
        appState: AppState.currentState,
        databaseIsReady: false,
      };
    }

    componentDidMount() {
      // App is starting up
      this.appIsNowRunningInForeground();
      this.setState({
        appState: 'active',
      });
      // Listen for app state changes
      AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
      // Remove app state change listener
      AppState.removeEventListener('change', this.handleAppStateChange);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

    // Handle the app going from foreground to background, and vice versa.
    handleAppStateChange = (nextAppState: string) => {
      if (this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active') {
        // App has moved from the background (or inactive) into the foreground
        this.appIsNowRunningInForeground();
      } else if (this.state.appState === 'active' &&
          nextAppState.match(/inactive|background/)) {
        // App has moved from the foreground into the background (or become inactive)
        this.appHasGoneToTheBackground();
      }

      this.setState({ appState: nextAppState });
    }

    // Code to run when app is brought to the foreground
    appIsNowRunningInForeground() {
      return database.open().then(() => this.setState({
        databaseIsReady: true,
      }));
    }

    // Code to run when app is sent to the background
    appHasGoneToTheBackground() {
      database.close();
    }
  };
}

export default connectDatabase;
