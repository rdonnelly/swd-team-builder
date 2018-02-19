import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import DeviceInfo from 'react-native-device-info';

import { getAvailableTeamsCount } from '../selectors/teamSelectors';

import { colors } from '../styles';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    left: 24,
    minWidth: 24,
    paddingHorizontal: 4,
    position: 'absolute',
    top: 0,
  },
  badgeText: {
    color: 'white',
  },
});


class BadgeTabIcon extends PureComponent {
  render() {
    const majorVersion = parseInt(Platform.Version, 10);
    const isIos = Platform.OS === 'ios';
    const useHorizontalTabs = DeviceInfo.isTablet() && isIos && majorVersion >= 11;

    const containerStyles = [
      styles.container,
      { marginTop: useHorizontalTabs ? 2 : 4 },
    ];

    const badgeStyles = [
      styles.badge,
      {
        left: useHorizontalTabs ? 76 : 24,
        top: useHorizontalTabs ? -24 : -2,
      },
    ];

    const icon = (
      <Icon name={ this.props.iconName } size={ this.props.size } color={ this.props.color } />
    );

    const badge = this.props.showBadge ? (
      <View style={ badgeStyles }>
        <Text style={ styles.badgeText }>
          { this.props.teamsCount }
        </Text>
      </View>
    ) : null;

    return (
      <View style={ containerStyles }>
        { icon }
        { badge }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  teamsCount: getAvailableTeamsCount(state),
});

export default connect(mapStateToProps)(BadgeTabIcon);

BadgeTabIcon.propTypes = {
  teamsCount: PropTypes.number.isRequired,
  iconName: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  showBadge: PropTypes.bool,
};
