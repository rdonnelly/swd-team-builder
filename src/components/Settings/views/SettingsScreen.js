import React, { Component } from 'react';
import {
  Slider,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { updateSetting } from '../../../actions';


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    padding: '20%',
    width: '100%',
  },
});

class SettingsView extends Component {
  static navigationOptions = {
    title: 'Settings',
  }

  updateSetting(key, value) {
    this.props.updateSetting(key, value);
  }

  render() {
    const { settingsState } = this.props;

    return (
      <View style={ styles.container }>
        <Text>{ 'Min Dice' + settingsState.get('minDice') }</Text>
        <Slider
          minimumTrackTintColor={'rgba(149, 165, 166, 1.0)'}
          maximumTrackTintColor={'rgba(155, 89, 182, 1.0)'}
          value={ settingsState.get('minDice') }
          minimumValue={ 0 }
          maximumValue={ 4 }
          step={ 1 }
          onValueChange={ (value) => this.updateSetting('minDice', value) }
        />

        <Text>{ 'Max Dice' + settingsState.get('maxDice') }</Text>
        <Slider
          minimumTrackTintColor={'rgba(155, 89, 182, 1.0)'}
          maximumTrackTintColor={'rgba(149, 165, 166, 1.0)'}
          value={ settingsState.get('maxDice') }
          minimumValue={ 0 }
          maximumValue={ 4 }
          step={ 1 }
          onValueChange={ (value) => this.updateSetting('maxDice', value) }
        />
      </View>
    );
  }
}


const mapStateToProps = state => ({
  settingsState: state.settingsReducer,
});

const mapDispatchToProps = { updateSetting };

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
