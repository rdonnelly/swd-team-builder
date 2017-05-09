import { StackNavigator } from 'react-navigation';
import SettingsScreen from './views/SettingsScreen';

const routeConfiguration = {
  SettingsScreen: { screen: SettingsScreen },
};

const stackNavigatorConfiguration = {
  initialRoute: 'SettingsScreen',
};

export const SettingsNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
