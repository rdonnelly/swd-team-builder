import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import CharacterListScreen from '../screens/Characters/CharacterListScreen';
import CharacterDetailScreen from '../screens/Characters/CharacterDetailScreen';

import { base, colors } from '../styles';

const styles = StyleSheet.create({
  headerIconContainer: {
    ...base.headerIconContainer,
  },
  headerIcon: {
    ...base.headerIcon,
  },
});

const routeConfiguration = {
  CharacterListScreen: {
    screen: CharacterListScreen,
    path: 'list',
    navigationOptions: ({ navigation }) => {
      const { state } = navigation;
      return {
        headerTitle: 'Characters',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              state.params.showSearchInput();
            }}
            style={styles.headerIconContainer}
          >
            <FontAwesome5Icon
              name={'search'}
              size={18}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        ),
      };
    },
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

const PlatformKeyboardAvoidingViewProps = Platform.select({
  ios: () => ({ behavior: 'height' }),
  android: () => ({}),
})();

class KeyboardAvoidingCharacterStackNavigator extends PureComponent {
  static router = CharacterStackNavigator.router;

  render() {
    const { navigation } = this.props;
    const keyboardAvoidingViewStyle = { flex: 1 };
    return (
      <KeyboardAvoidingView
        {...PlatformKeyboardAvoidingViewProps}
        style={keyboardAvoidingViewStyle}
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
