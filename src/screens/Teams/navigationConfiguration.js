import _get from 'lodash/get';
import { createStackNavigator } from 'react-navigation';

import TeamListScreen from './views/TeamListScreen';
import TeamDetailScreen from './views/TeamDetailScreen';

const routeConfiguration = {
  TeamListScreen: { screen: TeamListScreen },
  TeamDetailScreen: { screen: TeamDetailScreen },
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
        navigation.navigate('TeamListScreen');
      }
    }
  },
};

export default teamStackNavigator;
