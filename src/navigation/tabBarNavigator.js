import React from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { createBottomTabNavigator } from 'react-navigation';

import characterStackNavigator from './characterStackNavigator';
import teamStackNavigator from './teamStackNavigator';
import settingsStackNavigator from './settingsStackNavigator';
import BadgeTabIcon from '../components/BadgeTabIcon';

import { colors } from '../styles';

const majorVersion = parseInt(Platform.Version, 10);
const isIos = Platform.OS === 'ios';
const useHorizontalTabs = DeviceInfo.isTablet() && isIos && majorVersion >= 11;

export default createBottomTabNavigator(
  {
    Characters: { screen: characterStackNavigator },
    Teams: { screen: teamStackNavigator },
    Settings: { screen: settingsStackNavigator },
  },
  {
    backBehavior: 'none',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
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
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.tabActiveTint,
      inactiveTintColor: colors.tabInactiveTint,
      labelStyle: {
        fontSize: useHorizontalTabs ? 15 : 13,
      },
    },
  },
);
