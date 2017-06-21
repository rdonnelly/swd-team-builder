import { StackNavigator } from 'react-navigation';
import TeamListScreen from './views/TeamListScreen';
import TeamDetailScreen from './views/TeamDetailScreen';

const routeConfiguration = {
  TeamListScreen: { screen: TeamListScreen },
  TeamDetailScreen: { screen: TeamDetailScreen },
};

const stackNavigatorConfiguration = {
  initialRoute: 'TeamListScreen',
};

export const TeamNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
