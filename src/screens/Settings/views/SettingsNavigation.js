import React from 'react';

import { SettingsNavigator } from '../navigationConfiguration';
import BadgeTabIcon from '../../../components/BadgeTabIcon';


export default class SettingsNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ tintColor, focused }) =>
      <BadgeTabIcon
        iconName={ 'cog' }
        size={ 24 }
        color={ tintColor }
        selected={ focused }
        showBadge={ false }
      />,
  }

  render() {
    return (
      <SettingsNavigator />
    );
  }
}
