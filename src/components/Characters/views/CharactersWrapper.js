import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import BadgeTabIcon from '../../BadgeTabIcon/BadgeTabIcon';


class CharactersWrapper extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Characters',
    tabBarIcon: ({ tintColor, focused }) => (
        <BadgeTabIcon
          iconName="add-to-list"
          size={ 30 }
          color={ tintColor }
          selected={ focused }
          showBadge={ false }
        />
    ),
  }

  render() {
    return (
      <View>
        <View><Text>what</Text></View>
        <View><Text>what</Text></View>
      </View>
    );
  }
}

export default CharactersWrapper;
