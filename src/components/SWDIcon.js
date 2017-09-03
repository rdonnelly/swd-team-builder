import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import * as swdIconCodes from '../lib/swd-icons';

class SWDIcon extends Component {

  render() {
    const { type, font, style, addSpace } = this.props;

    if (!swdIconCodes[font] || !swdIconCodes[font][type]) {
      return null;
    }

    const code = String.fromCharCode(parseInt(swdIconCodes[font][type], 16));

    return (
      <Text style={[style, { fontFamily: font }]}>
        { code }
        { addSpace ? ' ' : '' }
      </Text>
    );
  }
}

export default SWDIcon;

SWDIcon.propTypes = {
  type: PropTypes.string.isRequired,
  font: PropTypes.string.isRequired,
  style: PropTypes.any,
  addSpace: PropTypes.bool,
};
