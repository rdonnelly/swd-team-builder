import React, { Component } from 'react';
import {
  Slider,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { updateSetting } from '../../../actions';
import { teamsStatsData } from '../../../lib/Destiny';


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
        <Text>{ `Min Points ${settingsState.get('minPoints')}` }</Text>
        <Slider
          minimumTrackTintColor={'rgba(155, 89, 182, 1.0)'}
          maximumTrackTintColor={'rgba(149, 165, 166, 1.0)'}
          value={ settingsState.get('minPoints') }
          minimumValue={ teamsStatsData.minPoints }
          maximumValue={ teamsStatsData.maxPoints }
          step={ 1 }
          onValueChange={ value => this.updateSetting('minPoints', value) }
        />

        <Text>{ `Max Points ${settingsState.get('maxPoints')}` }</Text>
        <Slider
          minimumTrackTintColor={'rgba(149, 165, 166, 1.0)'}
          maximumTrackTintColor={'rgba(155, 89, 182, 1.0)'}
          value={ settingsState.get('maxPoints') }
          minimumValue={ teamsStatsData.minPoints }
          maximumValue={ teamsStatsData.maxPoints }
          step={ 1 }
          onValueChange={ value => this.updateSetting('maxPoints', value) }
        />

        <Text>{ `Min Dice ${settingsState.get('minDice')}` }</Text>
        <Slider
          minimumTrackTintColor={'rgba(155, 89, 182, 1.0)'}
          maximumTrackTintColor={'rgba(149, 165, 166, 1.0)'}
          value={ settingsState.get('minDice') }
          minimumValue={ teamsStatsData.minDice }
          maximumValue={ teamsStatsData.maxDice }
          step={ 1 }
          onValueChange={ value => this.updateSetting('minDice', value) }
        />

        <Text>{ `Max Dice ${settingsState.get('maxDice')}` }</Text>
        <Slider
          minimumTrackTintColor={'rgba(149, 165, 166, 1.0)'}
          maximumTrackTintColor={'rgba(155, 89, 182, 1.0)'}
          value={ settingsState.get('maxDice') }
          minimumValue={ teamsStatsData.minDice }
          maximumValue={ teamsStatsData.maxDice }
          step={ 1 }
          onValueChange={ value => this.updateSetting('maxDice', value) }
        />

        <Text>{ `Min Health ${settingsState.get('minHealth')}` }</Text>
        <Slider
          minimumTrackTintColor={'rgba(149, 165, 166, 1.0)'}
          maximumTrackTintColor={'rgba(155, 89, 182, 1.0)'}
          value={ settingsState.get('minHealth') }
          minimumValue={ teamsStatsData.minHealth }
          maximumValue={ teamsStatsData.maxHealth }
          step={ 1 }
          onValueChange={ value => this.updateSetting('minHealth', value) }
        />

        <Text>{ `Show Mixed Damage Teams ${settingsState.get('mixedDamage')}` }</Text>
        <Switch
          onValueChange={ value => this.updateSetting('mixedDamage', value) }
          value={ settingsState.get('mixedDamage') }
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
