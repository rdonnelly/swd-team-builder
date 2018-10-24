/* eslint-disable react/display-name */
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';

import characterStackNavigator from './characterStackNavigator';
import teamStackNavigator from './teamStackNavigator';
import settingsStackNavigator from './settingsStackNavigator';
import BadgeTabIcon from '../components/BadgeTabIcon';

import { colors } from '../styles';


export default createBottomTabNavigator(
  {
    Characters: { screen: characterStackNavigator },
    Teams: { screen: teamStackNavigator },
    Settings: { screen: settingsStackNavigator },
  },
  {
    backBehavior: 'none',
    navigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let showBadge = false;
        if (routeName === 'Characters') {
          iconName = 'documents';
        } else if (routeName === 'Teams') {
          iconName = 'list';
          showBadge = true;
        } else if (routeName === 'Settings') {
          iconName = 'cog';
        }

        return (
          <BadgeTabIcon
            iconName={ iconName }
            size={ 24 }
            color={ tintColor }
            selected={ focused }
            showBadge={ showBadge }
            horizontal={ horizontal }
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.tabActiveTint,
      inactiveTintColor: colors.tabInactiveTint,
      labelStyle: {
        fontSize: 13,
      },
    },
  },
);
