import React, { Component } from 'react';
import { Text } from 'react-native';

import swdIcons from '../../static/swd-icons';

export default class SWDIcon extends Component {

  render() {
    const { type, font, style } = this.props;

    const code = String.fromCharCode(parseInt(swdIcons[type], 16));

    return (
      <Text style={[style, { fontFamily: font }]}>
        { code }
      </Text>
    );
  }
}

SWDIcon.propTypes = {
  type: React.PropTypes.string.isRequired,
  font: React.PropTypes.string.isRequired,
  style: React.PropTypes.any,
};
