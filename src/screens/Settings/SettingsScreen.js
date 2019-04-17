import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { connect } from 'react-redux';
import SafariView from 'react-native-safari-view';

import SettingCloud from '../../components/SettingCloud';
import SettingSlider from '../../components/SettingSlider';

import { resetFilters, updateSetting } from '../../store/actions';
import { getSettings } from '../../store/selectors/teamSelectors';

import {
  charactersStats,
  plotsStats,
  teamsStats,

  affiliations,
  damageTypes,
  factions,
  formats,
} from '../../lib/Destiny';

import { base as baseStyles, colors } from '../../styles';


const styles = StyleSheet.create({
  container: {
    ...baseStyles.container,
    backgroundColor: colors.lightGray,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 76,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  floatingControls: {
    ...baseStyles.floatingControls,
  },
  floatingControlsButton: {
    ...baseStyles.button,
  },
  floatingControlsButtonText: {
    ...baseStyles.buttonText,
  },
  information: {
    borderColor: colors.lightGrayDark,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginBottom: 24,
    paddingTop: 24,
  },
  disclaimerText: {
    color: colors.gray,
    textAlign: 'center',
  },
  disclaimerTextBold: {
    fontWeight: '600',
  },
  linkText: {
    color: colors.brand,
    textAlign: 'center',
  },
});

class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    SafariView.addEventListener(
      'onShow',
      () => {
        StatusBar.setBarStyle('dark-content');
      },
    );

    SafariView.addEventListener(
      'onDismiss',
      () => {
        StatusBar.setBarStyle('light-content');
      },
    );

    if (props.navigation) {
      props.navigation.setParams({
        resetScreen: this.resetScreen,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.settings !== nextProps.settings) {
      return true;
    }

    return false;
  }

  static visitWebpage() {
    SafariView.show({
      tintColor: colors.brand,
      url: 'http://rdonnelly.com/swd-team-builder/',
    });
  }

  resetScreen = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ y: 0 });
    }
  }

  removeAllFilters = () => {
    Alert.alert(
      'Reset Filters?',
      'This will reset all filters. Are you sure you want to continue?',
      [
        { text: 'Cancel' },
        {
          text: 'Reset',
          onPress: () => {
            ReactNativeHapticFeedback.trigger('impactHeavy');

            this.props.resetFilters();

            this.affiliationsCloud.reset();
            this.damageTypesCloud.reset();
            this.factionsCloud.reset();
            this.formatsCloud.reset();
            this.plotFactionCloud.reset();

            this.minDiceSlider.reset();
            this.minHealthSlider.reset();
            this.minCharacterCountSlider.reset();
            this.maxCharacterCountSlider.reset();
            this.plotPointsSlider.reset();
          },
          style: 'destructive',
        },
      ],
    );
  }

  renderReset() {
    return (
      <View style={ styles.floatingControls }>
        <TouchableOpacity
          onPress={ this.removeAllFilters }
          style={ styles.floatingControlsButton }
        >
          <Text style={ styles.floatingControlsButtonText }>Reset Filters</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { settings } = this.props;

    const formatsCloud = (
      <SettingCloud
        label={ 'Format' }
        setting={ 'formats' }
        options={ formats }
        radio={ true }
        values={ settings.filters.formats }
        callback={ this.props.updateSetting }
        ref={ (component) => { this.formatsCloud = component; } }
      />
    );

    const affiliationsCloud = (
      <SettingCloud
        label={ 'Affiliations' }
        setting={ 'affiliations' }
        options={ affiliations }
        values={ settings.filters.affiliations }
        callback={ this.props.updateSetting }
        ref={ (component) => { this.affiliationsCloud = component; } }
      />
    );

    const factionsCloud = (
      <SettingCloud
        label={ 'Factions' }
        setting={ 'factions' }
        options={ factions }
        values={ settings.filters.factions }
        callback={ this.props.updateSetting }
        ref={ (component) => { this.factionsCloud = component; } }
      />
    );

    const damageTypesCloud = (
      <SettingCloud
        label={ 'Damage Types' }
        setting={ 'damageTypes' }
        options={ damageTypes }
        values={ settings.filters.damageTypes }
        callback={ this.props.updateSetting }
        ref={ (component) => { this.damageTypesCloud = component; } }
      />
    );

    const plotFactionCloud = (
      <SettingCloud
        label={ 'Plot Faction' }
        setting={ 'plotFactions' }
        options={ factions }
        values={ settings.filters.plotFactions }
        radio={ true }
        callback={ this.props.updateSetting }
        ref={ (component) => { this.plotFactionCloud = component; } }
      />
    );

    return (
      <View style={ styles.container }>
        <ScrollView
          ref={ (component) => { this.scrollView = component; } }
          style={ styles.scrollView }
          contentContainerStyle={ styles.scrollViewContent }
        >
          { formatsCloud }

          <SettingSlider
            value={ settings.filters.minDice }
            minValue={ teamsStats.minDice }
            maxValue={ teamsStats.maxDice }
            setting={ 'minDice' }
            label={ 'Minimum Dice' }
            callback={ this.props.updateSetting }
            ref={ (component) => { this.minDiceSlider = component; } }
          />

          <SettingSlider
            value={ settings.filters.minHealth }
            minValue={ teamsStats.minHealth }
            maxValue={ teamsStats.maxHealth }
            setting={ 'minHealth' }
            label={ 'Minimum Health' }
            callback={ this.props.updateSetting }
            ref={ (component) => { this.minHealthSlider = component; } }
          />

          <SettingSlider
            value={ settings.filters.minCharacterCount }
            minValue={ teamsStats.minCharacterCount }
            maxValue={ teamsStats.maxCharacterCount }
            setting={ 'minCharacterCount' }
            label={ 'Minimum Character Count' }
            callback={ this.props.updateSetting }
            ref={ (component) => { this.minCharacterCountSlider = component; } }
          />

          <SettingSlider
            value={ settings.filters.maxCharacterCount }
            minValue={ teamsStats.minCharacterCount }
            maxValue={ teamsStats.maxCharacterCount }
            setting={ 'maxCharacterCount' }
            label={ 'Maximum Character Count' }
            reverse={ true }
            callback={ this.props.updateSetting }
            ref={ (component) => { this.maxCharacterCountSlider = component; } }
          />

          { affiliationsCloud }

          { factionsCloud }

          { damageTypesCloud }


          <SettingSlider
            value={ settings.filters.plotPoints }
            minValue={ plotsStats.minPoints }
            maxValue={ plotsStats.maxPoints }
            setting={ 'plotPoints' }
            label={ 'Plot Points' }
            callback={ this.props.updateSetting }
            ref={ (component) => { this.plotPointsSlider = component; } }
          />

          { plotFactionCloud }

          <View style={ styles.information }>
            <Text style={ styles.disclaimerText }>
              Generated
              <Text style={ styles.disclaimerTextBold }> {teamsStats.count}</Text> Teams using
              <Text style={ styles.disclaimerTextBold }> {charactersStats.count}</Text> Characters and
              <Text style={ styles.disclaimerTextBold }> {plotsStats.count}</Text> Plots.
            </Text>
          </View>

          <View style={ styles.information }>
            <Text style={ styles.disclaimerText }>
              The information presented in this app about Star Wars Destiny,
              both literal and graphical, is copyrighted by Fantasy Flight
              Games. This app is not produced by, endorsed by, supported by, or
              affiliated with Fantasy Flight Games.
            </Text>
          </View>

          <View style={ styles.information }>
            <TouchableOpacity onPress={ SettingsScreen.visitWebpage }>
              <Text style={ styles.linkText }>
                Designed and Developed by
              </Text>
              <Text style={ styles.linkText }>
                Ryan Donnelly
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        { this.renderReset() }
      </View>
    );
  }
}

SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,

  settings: PropTypes.object.isRequired,

  resetFilters: PropTypes.func.isRequired,
  updateSetting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  settings: getSettings(state),
});

const mapDispatchToProps = {
  resetFilters,
  updateSetting,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
