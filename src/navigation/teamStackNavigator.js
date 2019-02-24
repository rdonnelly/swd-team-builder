import { createStackNavigator } from 'react-navigation';

import TeamListScreen from '../screens/Teams/TeamListScreen';
import TeamDetailScreen from '../screens/Teams/TeamDetailScreen';

import { colors } from '../styles';

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
  initialRouteName: 'TeamListScreen',
  defaultNavigationOptions: {
    headerTintColor: colors.headerTint,
    headerStyle: {
      backgroundColor: colors.headerBackground,
    },
  },
};

const TeamStackNavigator = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration,
);

export default TeamStackNavigator;
