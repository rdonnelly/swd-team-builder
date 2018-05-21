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
  tabBarOnPress: ({ navigation }) => {
    if (navigation.isFocused()) {
      if (navigation.state.index === 0) {
        const stackNavigation = _get(navigation, 'state.routes[0]');
        if (stackNavigation &&
            stackNavigation.params &&
            stackNavigation.params.scrollToTop) {
          stackNavigation.params.scrollToTop();
        }
      }

      if (navigation.state.index === 1) {
        navigation.navigate('SettingsScreen');
      }
    }
  },
};

export default settingsStackNavigator;
