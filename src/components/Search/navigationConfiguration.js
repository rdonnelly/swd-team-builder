import { StackNavigator } from 'react-navigation';
import SearchScreen from './views/SearchScreen';
import SearchDetailsScreen from './views/SearchDetailsScreen';

const routeConfiguration = {
  SearchScreen: { screen: SearchScreen },
  SearchDetailsScreen: { screen: SearchDetailsScreen },
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  initialRoute: 'SearchScreen',
};

export const SearchNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
