import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import { colors } from '../styles';

const styles = StyleSheet.create({
  container: {},
  badgeContainer: {
    position: 'absolute',
    left: 24,
    top: 4,
  },
  badge: {
    backgroundColor: colors.brand,
    borderRadius: 10,
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
  },
  badgeText: {
    color: colors.white,
    textAlign: 'center',
  },
});

class TabIcon extends PureComponent {
  render() {
    const iconStyles = {
      marginTop: this.props.horizontal ? 0 : 5,
    };

    const icon = (
      <Icon
        name={this.props.iconName}
        size={this.props.size}
        color={this.props.color}
        style={iconStyles}
      />
    );

    return <View style={styles.container}>{icon}</View>;
  }
}

TabIcon.propTypes = {
  data: PropTypes.number,
  iconName: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  horizontal: PropTypes.bool,
};

export default TabIcon;
