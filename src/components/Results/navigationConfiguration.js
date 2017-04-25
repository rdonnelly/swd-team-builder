import { StackNavigator } from 'react-navigation';
import ResultsScreen from './views/ResultsScreen';

const routeConfiguration = {
  ResultsScreen: { screen: ResultsScreen },
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  initialRoute: 'ResultsScreen',
};

export const ResultsNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
