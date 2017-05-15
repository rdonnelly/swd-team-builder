import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 182, 1.0)',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    left: 16,
    minWidth: 20,
    paddingLeft: 5,
    paddingRight: 5,
    position: 'absolute',
    top: 0,
  },
  badgeText: {
    color: 'white',
  },
});


class BadgeTabIcon extends Component {
  render() {
    const { teamsState } = this.props;

    const icon = (
      <Icon name={ this.props.iconName } size={ this.props.size } color={ this.props.color } />
    );

    const badge = this.props.showBadge ? (
      <View style={ styles.badge }>
        <Text style={ styles.badgeText }>{ teamsState.get('teams').count() }</Text>
      </View>
    ) : null;

    return (
      <View>
        { icon }
        { badge }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  teamsState: state.teamsReducer,
});

export default connect(mapStateToProps)(BadgeTabIcon);
