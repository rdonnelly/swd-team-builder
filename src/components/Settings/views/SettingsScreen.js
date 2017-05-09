import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    width: '100%',
  },
});

class SettingsView extends Component {
  static navigationOptions = {
    title: 'Settings',
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text>{ 'Settings' }</Text>
      </View>
    );
  }
}

export default SettingsView;
