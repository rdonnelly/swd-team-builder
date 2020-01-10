import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import TeamListScreen from '../screens/Teams/TeamListScreen';
import TeamDetailScreen from '../screens/Teams/TeamDetailScreen';

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
  TeamListScreen: {
    screen: TeamListScreen,
    path: 'list',
    navigationOptions: ({ navigation }) => {
      const { state } = navigation;
      return {
        headerTitle: 'Teams',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              state.params.showSortActionSheet();
            }}
            style={styles.headerIconContainer}
          >
            <FontAwesome5Icon
              name={'sort-amount-down'}
              size={18}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        ),
      };
    },
  },
  TeamDetailScreen: {
    screen: TeamDetailScreen,
    path: 'details/:key',
  },
};

const stackNavigatorConfiguration = {
  initialRouteName: 'TeamListScreen',
  defaultNavigationOptions: {
    headerTintColor: colors.headerTint,
    headerStyle: {
      backgroundColor: colors.headerBackground,
    },
  },
};

const TeamStackNavigator = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration,
);

export default TeamStackNavigator;
