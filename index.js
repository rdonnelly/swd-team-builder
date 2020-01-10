import { AppRegistry, YellowBox } from 'react-native';
import { Client } from 'bugsnag-react-native';
import { useScreens } from 'react-native-screens';
import 'react-native-gesture-handler';

import { name as appName } from './app.json';
import setup from './src/setup';

YellowBox.ignoreWarnings(['-[RCTRootView cancelTouches]']);

useScreens();

if (!__DEV__) {
  // eslint-disable-next-line no-unused-vars
  const bugsnag = new Client();
}

AppRegistry.registerComponent(appName, setup);
