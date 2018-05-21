import _get from 'lodash/get';
import { createStackNavigator } from 'react-navigation';

import SettingsScreen from './views/SettingsScreen';

const routeConfiguration = {
  SettingsScreen: { screen: SettingsScreen },
};

const stackNavigatorConfiguration = {
  initialRoute: 'SettingsScreen',
};

const teamStackNavigator = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration,
);

teamStackNavigator.navigationOptions = {
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

export default teamStackNavigator;
