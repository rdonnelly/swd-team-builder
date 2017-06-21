import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import SettingSlider from '../../../components/SettingSlider';
import SettingSwitch from '../../../components/SettingSwitch';

import { updateSetting } from '../../../actions';
import { teamsStatsData } from '../../../lib/Destiny';


const styles = StyleSheet.create({
  container: {

    alignItems: 'center',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10%',
  },
});

class SettingsView extends Component {
  static navigationOptions = {
    title: 'Settings',
    headerTintColor: 'rgba(52, 73, 94, 1.0)',
    headerStyle: {
      backgroundColor: 'rgba(236, 240, 241, 1.0)',
    },
  }

  constructor(props) {
    super(props);
    this.state = { updateTimeoutId: false };
  }

  updateSetting(key, value) {
    if (this.state.updateTimeoutId) {
      clearTimeout(this.state.updateTimeoutId);
    }

    const updateTimeoutId = setTimeout(() => {
      this.setState({ updateTimeoutId: null });
      this.props.updateSetting(key, value);
    }, 0);

    this.setState({ updateTimeoutId });
  }

  render() {
    const { teamsState } = this.props;
    const settings = teamsState.get('settings');

    return (
      <View style={ styles.container }>
        <SettingSlider
          value={ settings.get('minDice') }
          minValue={ teamsStatsData.minDice }
          maxValue={ teamsStatsData.maxDice }
          setting={ 'minDice' }
          label={ 'Minimum Dice' }
          callback={ this.props.updateSetting }
        />

        <SettingSlider
          value={ settings.get('minHealth') }
          minValue={ teamsStatsData.minHealth }
          maxValue={ teamsStatsData.maxHealth }
          setting={ 'minHealth' }
          label={ 'Minimum Health' }
          callback={ this.props.updateSetting }
        />

        <SettingSlider
          value={ settings.get('minPoints') }
          minValue={ teamsStatsData.minPoints }
          maxValue={ teamsStatsData.maxPoints }
          setting={ 'minPoints' }
          label={ 'Minimum Points' }
          callback={ this.props.updateSetting }
        />

        <SettingSwitch
          value={ settings.get('minPoints') }
          setting={ 'mixedDamage' }
          label={ 'Mixed Damage Teams' }
          callback={ this.props.updateSetting }
        />
      </View>
    );
  }
}


const mapStateToProps = state => ({
  teamsState: state.teamsReducer,
});

const mapDispatchToProps = { updateSetting };

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);

SettingsView.propTypes = {
  teamsState: React.PropTypes.object.isRequired,
  updateSetting: React.PropTypes.func.isRequired,
};
