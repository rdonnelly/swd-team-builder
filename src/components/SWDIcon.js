import React, { PureComponent } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import { iconCodes as swdIconCodes } from '../lib/SWDIconCodes';

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

    const code = _get(swdIconCodes, type.toUpperCase());
    if (!code) {
      return null;
    }

    const codeString = String.fromCharCode(parseInt(code, 16));

    return (
      <Text style={[style, styles.text]}>
        { codeString }
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
