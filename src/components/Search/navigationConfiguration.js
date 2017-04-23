import { StackNavigator } from 'react-navigation';
import SearchScreen from './views/SearchScreen';

const routeConfiguration = {
  SearchScreen: { screen: SearchScreen },
};

// going to disable the header for now
const stackNavigatorConfiguration = {
  headerMode: 'none',
  initialRoute: 'SearchScreen',
};

export const SearchNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
