import { StackNavigator } from 'react-navigation';
import CharacterListScreen from './views/CharacterListScreen';
import CharacterDetailScreen from './views/CharacterDetailScreen';

const routeConfiguration = {
  CharacterListScreen: { screen: CharacterListScreen },
  CharacterDetailScreen: { screen: CharacterDetailScreen },
};

const stackNavigatorConfiguration = {
  initialRoute: 'CharacterListScreen',
};

export const CharacterNavigator = StackNavigator(routeConfiguration, stackNavigatorConfiguration);
