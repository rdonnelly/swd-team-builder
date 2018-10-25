import _get from 'lodash/get';
import { createStackNavigator } from 'react-navigation';

import TeamListScreen from '../screens/Teams/TeamListScreen';
import TeamDetailScreen from '../screens/Teams/TeamDetailScreen';

const routeConfiguration = {
  TeamListScreen: {
    screen: TeamListScreen,
    path: 'list',
  },
  TeamDetailScreen: {
    screen: TeamDetailScreen,
    path: 'details/:key',
  },
};

const stackNavigatorConfiguration = {
  initialRoute: 'TeamListScreen',
};

const teamStackNavigator = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration,
);

teamStackNavigator.navigationOptions = {
  tabBarLabel: 'Teams',
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
        navigation.navigate('TeamListScreen');
      }
    } else {
      defaultHandler();
    }
  },
};

export default teamStackNavigator;
