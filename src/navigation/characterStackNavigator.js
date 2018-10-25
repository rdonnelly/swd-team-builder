import _get from 'lodash/get';
import { createStackNavigator } from 'react-navigation';

import CharacterListScreen from '../screens/Characters/CharacterListScreen';
import CharacterDetailScreen from '../screens/Characters/CharacterDetailScreen';

const routeConfiguration = {
  CharacterListScreen: {
    screen: CharacterListScreen,
    path: 'list',
  },
  CharacterDetailScreen: {
    screen: CharacterDetailScreen,
    path: 'details/:id',
  },
};

const stackNavigatorConfiguration = {
  initialRoute: 'CharacterListScreen',
};

const characterStackNavigator = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration,
);

characterStackNavigator.navigationOptions = {
  tabBarLabel: 'Characters',
  tabBarOnPress: ({ navigation, defaultHandler }) => {
    if (navigation.isFocused()) {
      if (navigation.state.index === 0) {
        const stackNavigation = _get(navigation, 'state.routes[0]');
        if (stackNavigation &&
            stackNavigation.params &&
            stackNavigation.params.resetScreen) {
          stackNavigation.params.resetScreen();
        }
      }

      if (navigation.state.index === 1) {
        navigation.navigate('CharacterListScreen');
      }
    } else {
      defaultHandler();
    }
  },
};

export default characterStackNavigator;
