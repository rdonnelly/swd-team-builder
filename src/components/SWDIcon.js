import React, { PureComponent } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import { iconCodes as swdIconCodes } from '../lib/swd-icons';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'swdestiny',
  },
});

class SWDIcon extends PureComponent {
  render() {
    const {
      type, style, addSpace,
    } = this.props;

    const code = String.fromCharCode(parseInt(swdIconCodes[type], 16));

    return (
      <Text style={[style, styles.text]}>
        { code }
        { addSpace ? ' ' : '' }
      </Text>
    );
  }
}

export default SWDIcon;

SWDIcon.propTypes = {
  type: PropTypes.string.isRequired,
  style: PropTypes.any,
  addSpace: PropTypes.bool,
};
