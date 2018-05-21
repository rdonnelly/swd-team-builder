import _get from 'lodash/get';
import { createStackNavigator } from 'react-navigation';

import CharacterListScreen from '../screens/Characters/CharacterListScreen';
import CharacterDetailScreen from '../screens/Characters/CharacterDetailScreen';

const routeConfiguration = {
  CharacterListScreen: { screen: CharacterListScreen },
  CharacterDetailScreen: { screen: CharacterDetailScreen },
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
  tabBarOnPress: ({ navigation }) => {
    if (navigation.isFocused()) {
      if (navigation.state.index === 0) {
        const stackNavigation = _get(navigation, 'state.routes[0]');
        if (stackNavigation &&
            stackNavigation.params &&
            stackNavigation.params.scrollToTop) {
          stackNavigation.params.scrollToTop();
        }
      }

      if (navigation.state.index === 1) {
        navigation.navigate('CharacterListScreen');
      }
    }
  },
};

export default characterStackNavigator;
