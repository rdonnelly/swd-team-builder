import React from 'react';

import { TeamNavigator } from '../navigationConfiguration';
import BadgeTabIcon from '../../../components/BadgeTabIcon';


export default class TeamNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Teams',
    tabBarIcon: ({ tintColor, focused }) =>
      <BadgeTabIcon
        iconName="list"
        size={ 30 }
        color={ tintColor }
        selected={ focused }
        showBadge={ true }
      />,
  }

  render() {
    return (
      <TeamNavigator />
    );
  }
}
