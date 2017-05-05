import { StackNavigator } from 'react-navigation';
import TeamsScreen from './views/TeamsScreen';

const routeConfiguration = {
  TeamsScreen: { screen: TeamsScreen },
};

const stackNavigatorConfiguration = {
  initialRoute: 'TeamsScreen',
};

export const TeamsNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
