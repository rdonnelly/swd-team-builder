import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';

import { getAvailableTeamsCount } from '../selectors/teamSelectors';

import { colors } from '../styles';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    left: 16,
    minWidth: 20,
    paddingLeft: 4,
    paddingRight: 4,
    position: 'absolute',
    top: 0,
  },
  badgeText: {
    color: 'white',
  },
});


class BadgeTabIcon extends PureComponent {
  render() {
    const icon = (
      <Icon name={ this.props.iconName } size={ this.props.size } color={ this.props.color } />
    );

    const badge = this.props.showBadge ? (
      <View style={ styles.badge }>
        <Text style={ styles.badgeText }>{ this.props.teamsCount }</Text>
      </View>
    ) : null;

    return (
      <View style={[styles.container, { height: this.props.size }]}>
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
