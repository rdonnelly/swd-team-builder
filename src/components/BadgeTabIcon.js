import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import withData from './withData';

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

class BadgeTabIcon extends PureComponent {
  render() {
    const { data: count, dataIsLoading } = this.props;

    let countLabel = '...';
    if (count != null && !dataIsLoading) {
      countLabel = count <= 1000 ? count : '1000+';
    }

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

    const badgeContainerStyles = [
      styles.badgeContainer,
      {
        left: this.props.horizontal ? 72 : 24,
        top: this.props.horizontal ? -6 : 4,
      },
    ];

    const badge = this.props.showBadge ? (
      <View style={badgeContainerStyles}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{countLabel}</Text>
        </View>
      </View>
    ) : null;

    return (
      <View style={styles.container}>
        {icon}
        {badge}
      </View>
    );
  }
}

BadgeTabIcon.propTypes = {
  data: PropTypes.number,
  iconName: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  showBadge: PropTypes.bool,
  horizontal: PropTypes.bool,
};

export default withData()(BadgeTabIcon, (dataSource) =>
  dataSource.getTeamsCount(),
);
