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

import { getAvailableTeamsCount } from '../store/selectors/teamSelectors';

import { colors } from '../styles';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: 64,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 10,
    flexGrow: 1,
    height: 20,
    justifyContent: 'center',
    left: 24,
    marginTop: 2,
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

    const badgeStyles = [
      styles.badge,
      {
        left: useHorizontalTabs ? 100 : 48,
      },
    ];

    const icon = (
      <Icon name={ this.props.iconName } size={ this.props.size } color={ this.props.color } />
    );

    const badge = this.props.showBadge ? (
      <View style={ styles.badgeContainer }>
        <View style={ badgeStyles }>
          <Text style={ styles.badgeText }>
            { this.props.teamsCount }
          </Text>
        </View>
      </View>
    ) : null;

    return (
      <View style={ styles.container }>
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
