import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import SafariView from 'react-native-safari-view';

import SettingCloud from '../../../components/SettingCloud';
import SettingSlider from '../../../components/SettingSlider';

import { updateSetting } from '../../../actions';
import { getSettings } from '../../../selectors/teamSelectors';

import {
  plotsStats,
  teamsStats,

  affiliations,
  damageTypes,
  factions,
  sets,
} from '../../../lib/Destiny';

import { colors } from '../../../styles';


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    flex: 1,
    width: '100%',
  },
  scrollContainer: {},
  scrollerInner: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  information: {
    borderColor: colors.lightGrayDark,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 24,
    paddingTop: 24,
  },
  disclaimerText: {
    color: colors.gray,
    textAlign: 'center',
  },
  linkText: {
    color: colors.purple,
    textAlign: 'center',
  },
});

class SettingsView extends PureComponent {
  static navigationOptions = {
    title: 'Settings',
    headerTintColor: colors.headerTint,
    headerStyle: {
      backgroundColor: colors.headerBackground,
    },
  }

  constructor(props) {
    super(props);

    this.state = { updateTimeoutId: false };

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

    this.scrollViewToTop = this.scrollViewToTop.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this.scrollViewToTop,
    });
  }

  scrollViewToTop() {
    this.scrollView.scrollTo(0);
  }

  visitWebpage() {
    SafariView.show({
      tintColor: colors.purple,
      url: 'http://rdonnelly.com/swd-team-builder/',
    });
  }

  render() {
    const { settings } = this.props;

    const plotFactionsCloud = (
      <SettingCloud
        label={ 'Plot Faction' }
        setting={ 'plotFactions' }
        options={ factions }
        values={ settings.filters.plotFactions }
        radio={ true }
        callback={ this.props.updateSetting }
      />
    );

    const affiliationsCloud = (
      <SettingCloud
        label={ 'Affiliations' }
        setting={ 'affiliations' }
        options={ affiliations }
        values={ settings.filters.affiliations }
        callback={ this.props.updateSetting }
      />
    );

    const factionsCloud = (
      <SettingCloud
        label={ 'Factions' }
        setting={ 'factions' }
        options={ factions }
        values={ settings.filters.factions }
        callback={ this.props.updateSetting }
      />
    );

    const damageTypesCloud = (
      <SettingCloud
        label={ 'Damage Types' }
        setting={ 'damageTypes' }
        options={ damageTypes }
        values={ settings.filters.damageTypes }
        callback={ this.props.updateSetting }
      />
    );

    const setsCloud = (
      <SettingCloud
        label={ 'Sets' }
        setting={ 'sets' }
        options={ sets }
        values={ settings.filters.sets }
        callback={ this.props.updateSetting }
      />
    );

    return (
      <View style={ styles.container }>
        <ScrollView
          ref={ (component) => { this.scrollView = component; } }
          style={ styles.scrollContainer }
        >
          <View style={ styles.scrollerInner }>
            <SettingSlider
              value={ settings.filters.minDice }
              minValue={ teamsStats.minDice }
              maxValue={ teamsStats.maxDice }
              setting={ 'minDice' }
              label={ 'Minimum Dice' }
              callback={ this.props.updateSetting }
            />

            <SettingSlider
              value={ settings.filters.minHealth }
              minValue={ teamsStats.minHealth }
              maxValue={ teamsStats.maxHealth }
              setting={ 'minHealth' }
              label={ 'Minimum Health' }
              callback={ this.props.updateSetting }
            />

            <SettingSlider
              value={ settings.filters.minCharacterCount }
              minValue={ teamsStats.minCharacterCount }
              maxValue={ teamsStats.maxCharacterCount }
              setting={ 'minCharacterCount' }
              label={ 'Minimum Character Count' }
              callback={ this.props.updateSetting }
            />

            <SettingSlider
              value={ settings.filters.maxCharacterCount }
              minValue={ teamsStats.minCharacterCount }
              maxValue={ teamsStats.maxCharacterCount }
              setting={ 'maxCharacterCount' }
              label={ 'Maximum Character Count' }
              reverse={ true }
              callback={ this.props.updateSetting }
            />

            <SettingSlider
              value={ settings.filters.minPoints }
              minValue={ teamsStats.minPoints }
              maxValue={ teamsStats.maxPoints }
              setting={ 'minPoints' }
              label={ 'Minimum Points' }
              callback={ this.props.updateSetting }
            />

            <SettingSlider
              value={ settings.filters.plotPoints }
              minValue={ 0 }
              maxValue={ plotsStats.maxPoints }
              setting={ 'plotPoints' }
              label={ 'Plot Points' }
              callback={ this.props.updateSetting }
            />

            { plotFactionsCloud }

            { affiliationsCloud }

            { factionsCloud }

            { damageTypesCloud }

            { setsCloud }

            <View style={ styles.information }>
              <Text style={ styles.disclaimerText }>
                The information presented in this app about Star Wars Destiny,
                both literal and graphical, is copyrighted by Fantasy Flight
                Games. This app is not produced by, endorsed by, supported by, or
                affiliated with Fantasy Flight Games.
              </Text>
            </View>

            <View style={ styles.information }>
              <TouchableOpacity onPress={ this.visitWebpage }>
                <Text style={ styles.linkText }>
                  Designed and Developed by
                </Text>
                <Text style={ styles.linkText }>
                  Ryan Donnelly
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = state => ({
  settings: getSettings(state),
});

const mapDispatchToProps = {
  updateSetting,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);

SettingsView.propTypes = {
  navigation: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  updateSetting: PropTypes.func.isRequired,
};
