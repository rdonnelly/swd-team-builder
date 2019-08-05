import React, { PureComponent } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {
  setCodes as setIconCodes,
  typeCodes as typeIconCodes,
  validateSetCode,
  validateTypeCode,
} from '../lib/SWDIconCodes';

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

    const fontStyle = {};

    const testType = type.toUpperCase();
    let code = null;
    if (validateSetCode(testType)) {
      code = _get(setIconCodes, type.toUpperCase());
      fontStyle.fontFamily = 'swdsets';
    }
    if (validateTypeCode(testType)) {
      code = _get(typeIconCodes, type.toUpperCase());
      fontStyle.fontFamily = 'swdtypes';
    }

    if (!code) {
      return null;
    }

    const codeString = String.fromCharCode(parseInt(code, 16));

    return (
      <Text style={[style, styles.text, fontStyle]}>
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
