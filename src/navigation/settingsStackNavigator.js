import { createStackNavigator } from 'react-navigation';

import SettingsScreen from '../screens/Settings/SettingsScreen';

import { colors } from '../styles';

const routeConfiguration = {
  SettingsScreen: {
    screen: SettingsScreen,
    path: 'index',
    navigationOptions: {
      headerTitle: 'Settings',
    },
  },
};

const stackNavigatorConfiguration = {
  initialRouteName: 'SettingsScreen',
  defaultNavigationOptions: {
    headerTintColor: colors.headerTint,
    headerStyle: {
      backgroundColor: colors.headerBackground,
    },
  },
};

const SettingsStackNavigator = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration,
);

export default SettingsStackNavigator;
