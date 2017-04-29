import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';


class BadgeTabIcon extends Component {
  render() {
    const { teamsState } = this.props;

    const icon = (
      <Icon name={ this.props.iconName } size={ this.props.size } color={ this.props.color } />
    );

    const badge = this.props.showBadge ? (
      <View style={{ position: 'absolute', left: 16, top: 0, backgroundColor: 'red', borderRadius: 10, height: 20, paddingLeft: 5, paddingRight: 5, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>{ teamsState.get('count') }</Text>
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
