import _get from 'lodash/get';
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import CharacterStackNavigator from './CharacterStackNavigator';
import TeamStackNavigator from './TeamStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import TabIcon from '../components/TabIcon';
import TabIconBadged from '../components/TabIconBadged';

import { colors } from '../styles';

const routeConfiguration = {
  Characters: {
    screen: CharacterStackNavigator,
    path: 'characters',
  },
  Teams: {
    screen: TeamStackNavigator,
    path: 'teams',
  },
  Settings: {
    screen: SettingsStackNavigator,
    path: 'settings',
  },
};

const tabNavigatorConfig = {
  initialRouteName: 'Characters',
  backBehavior: 'none',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;

      if (routeName === 'Teams') {
        return (
          <TabIconBadged
            iconName={'list'}
            size={24}
            color={tintColor}
            selected={focused}
            horizontal={horizontal}
          />
        );
      }

      let iconName;
      if (routeName === 'Characters') {
        iconName = 'documents';
      } else if (routeName === 'Settings') {
        iconName = 'cog';
      }

      return (
        <TabIcon
          iconName={iconName}
          size={24}
          color={tintColor}
          selected={focused}
          horizontal={horizontal}
        />
      );
    },
    tabBarOnPress: ({ navigation: tabNavigation, defaultHandler }) => {
      if (tabNavigation.isFocused() && tabNavigation.state.index === 0) {
        const stackNavigation = _get(tabNavigation, 'state.routes[0]');
        if (
          stackNavigation &&
          stackNavigation.params &&
          stackNavigation.params.resetScreen
        ) {
          stackNavigation.params.resetScreen();
        }
      } else {
        defaultHandler();
      }
    },
  }),
  tabBarOptions: {
    activeTintColor: colors.tabActiveTint,
    inactiveTintColor: colors.tabInactiveTint,
    labelStyle: {
      fontSize: 13,
    },
  },
};

const TabNavigator = createBottomTabNavigator(
  routeConfiguration,
  tabNavigatorConfig,
);

export default TabNavigator;
