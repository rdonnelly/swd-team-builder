import { AppRegistry } from 'react-native';
import { Client } from 'bugsnag-react-native';

import { name as appName } from './app.json';
import setup from './src/setup';

if (!__DEV__) {
  // eslint-disable-next-line no-unused-vars
  const bugsnag = new Client();
}

AppRegistry.registerComponent(appName, setup);
