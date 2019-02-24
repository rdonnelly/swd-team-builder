import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import CharacterListScreen from '../screens/Characters/CharacterListScreen';
import CharacterDetailScreen from '../screens/Characters/CharacterDetailScreen';

import { colors } from '../styles';

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
  initialRouteName: 'CharacterListScreen',
  defaultNavigationOptions: {
    headerTintColor: colors.headerTint,
    headerStyle: {
      backgroundColor: colors.headerBackground,
    },
  },
};

const CharacterStackNavigator = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration,
);

class KeyboardAvoidingCharacterStackNavigator extends PureComponent {
  static router = CharacterStackNavigator.router;

  render() {
    const { navigation } = this.props;
    const keyboardAvoidingViewStyle = { flex: 1 };
    return (
      <KeyboardAvoidingView
        behavior={ 'padding' }
        style={ keyboardAvoidingViewStyle }
      >
        <CharacterStackNavigator navigation={navigation} />
      </KeyboardAvoidingView>
    );
  }
}

KeyboardAvoidingCharacterStackNavigator.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default KeyboardAvoidingCharacterStackNavigator;
