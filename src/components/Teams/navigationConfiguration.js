import { StackNavigator } from 'react-navigation';
import TeamsScreen from './views/TeamsScreen';

const routeConfiguration = {
  TeamsScreen: { screen: TeamsScreen },
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  initialRoute: 'TeamsScreen',
};

export const TeamsNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
