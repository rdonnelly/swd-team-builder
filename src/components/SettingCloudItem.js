import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  containerOn: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
  },
  text: {
    color: 'rgba(127, 140, 141, 1.0)',
    fontSize: 15,
    fontWeight: '700',
  },
  textOn: {
    color: 'rgba(155, 89, 182, 1.0)',
  },
});

class SettingCloudItem extends PureComponent {
  static defaultProps = {
    value: true,
  };

  state = {
    value: this.props.value,
  };

  constructor(props) {
    super(props);

    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange() {
    this.setState({ value: !this.state.value });
    this.props.callback(this.props.setting, !this.state.value);
  }

  render() {
    const containerStyles = [styles.container];
    if (this.state.value) {
      containerStyles.push(styles.containerOn);
    }

    const textStyles = [styles.text];
    if (this.state.value) {
      textStyles.push(styles.textOn);
    }

    return (
      <TouchableOpacity
        onPress={ this.onValueChange }
        style={ containerStyles }
      >
        <Text style={ textStyles }>
          { this.props.label }
        </Text>
      </TouchableOpacity>
    );
  }
}

SettingCloudItem.propTypes = {
  value: PropTypes.bool.isRequired,
  setting: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,

  callback: PropTypes.func,
};

export default SettingCloudItem;
