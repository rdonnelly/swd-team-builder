import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import SettingSlider from '../../../components/SettingSlider';
import SettingSwitch from '../../../components/SettingSwitch';

import { updateSetting } from '../../../actions';
import { teamsStatsData } from '../../../lib/Destiny';


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    width: '100%',
  },
  scrollContainer: {},
  scrollerInner: {
    paddingHorizontal: '10%',
    paddingVertical: 24,
  },
  disclaimer: {
    borderTopWidth: 1,
    borderColor: 'rgba(189, 195, 199,1.0)',
    paddingTop: 24,
    marginTop: 16,
  },
  disclaimerText: {
    color: 'rgba(149, 165, 166, 1.0)',
  },
});

class SettingsView extends Component {
  static navigationOptions = {
    title: 'Settings',
    headerTintColor: 'rgba(255, 255, 255, 1.0)',
    headerStyle: {
      backgroundColor: 'rgba(155, 89, 182, 1.0)',
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
        <ScrollView style={ styles.scrollContainer }>
          <View style={ styles.scrollerInner }>
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

            <View style={ styles.disclaimer }>
              <Text style={ styles.disclaimerText }>
                The information presented in this app about Star Wars Destiny,
                both literal and graphical, is copyrighted by Fantasy Flight
                Games. This website is not produced by, endorsed by, supported by, or
                affiliated with Fantasy Flight Games.
              </Text>
            </View>
          </View>
        </ScrollView>
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
