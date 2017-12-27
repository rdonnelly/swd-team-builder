import React from 'react';

import { CharacterNavigator } from '../navigationConfiguration';
import BadgeTabIcon from '../../../components/BadgeTabIcon';


export default class CharacterNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Characters',
    tabBarIcon: ({ tintColor, focused }) =>
      <BadgeTabIcon
        iconName="copy"
        size={ 24 }
        color={ tintColor }
        selected={ focused }
        showBadge={ false }
      />,
  }

  render() {
    return (
      <CharacterNavigator />
    );
  }
}
