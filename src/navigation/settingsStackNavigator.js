import _get from 'lodash/get';
import { createStackNavigator } from 'react-navigation';

import SettingsScreen from '../screens/Settings/SettingsScreen';

const routeConfiguration = {
  SettingsScreen: { screen: SettingsScreen },
};

const stackNavigatorConfiguration = {
  initialRoute: 'SettingsScreen',
};

const settingsStackNavigator = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration,
);

settingsStackNavigator.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarOnPress: ({ navigation, defaultHandler }) => {
    if (navigation.isFocused()) {
      if (navigation.state.index === 0) {
        const stackNavigation = _get(navigation, 'state.routes[0]');
        if (stackNavigation &&
            stackNavigation.params &&
            stackNavigation.params.resetScreen) {
          stackNavigation.params.resetScreen();
        }
      }

      if (navigation.state.index === 1) {
        navigation.navigate('SettingsScreen');
      }
    } else {
      defaultHandler();
    }
  },
};

export default settingsStackNavigator;
