/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { AppRegistry } from 'react-native';
import { Client } from 'bugsnag-react-native';

import setup from './src/setup';

// eslint-disable-next-line no-unused-vars
const bugsnag = new Client();

AppRegistry.registerComponent('SWDTeamBuilder', setup);
