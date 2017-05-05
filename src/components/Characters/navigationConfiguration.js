import { StackNavigator } from 'react-navigation';
import CharactersScreen from './views/CharactersScreen';
import CharactersDetailsScreen from './views/CharactersDetailsScreen';

const routeConfiguration = {
  CharactersScreen: { screen: CharactersScreen },
  CharactersDetailsScreen: { screen: CharactersDetailsScreen },
};

const stackNavigatorConfiguration = {
  initialRoute: 'CharactersScreen',
};

export const CharactersNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
