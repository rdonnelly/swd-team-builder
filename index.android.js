import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
} from 'react-native';

export default class SWDTeamBuilder extends Component {
  render() {
    return (
      <View>
        <Text>
          Android Team Builder
        </Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('SWDTeamBuilder', () => SWDTeamBuilder);
