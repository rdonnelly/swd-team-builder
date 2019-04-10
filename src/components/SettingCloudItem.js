import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

import { base as baseStyles, colors } from '../styles';


const styles = StyleSheet.create({
  button: {
    ...baseStyles.button,
    backgroundColor: colors.whiteTranslucent,
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 12,
  },
  buttonOn: {
    backgroundColor: colors.white,
  },
  text: {
    ...baseStyles.buttonText,
    color: colors.grayDark,
    fontSize: 15,
  },
  textOn: {
    color: colors.brand,
  },
});

class SettingCloudItem extends PureComponent {
  handlePress = () => {
    this.props.handlePress(this.props.code);
  }

  handleLongPress = () => {
    this.props.handleLongPress(this.props.code);
  }

  render() {
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];

    if (this.props.value) {
      buttonStyles.push(styles.buttonOn);
      textStyles.push(styles.textOn);
    }

    return (
      <TouchableOpacity
        onPress={ this.handlePress }
        onLongPress={ this.handleLongPress }
        style={ buttonStyles }
      >
        <Text style={ textStyles }>
          { this.props.label }
        </Text>
      </TouchableOpacity>
    );
  }
}

SettingCloudItem.propTypes = {
  code: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,

  handlePress: PropTypes.func.isRequired,
  handleLongPress: PropTypes.func.isRequired,
};

export default SettingCloudItem;
