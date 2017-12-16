import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  label: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 16,
    fontWeight: '500',
  },
});

class SettingsSwitch extends PureComponent {
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

  onValueChange(value) {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      this.props.callback(this.props.setting, value);
      this.setState({ timeoutId: null });
    }, 500);

    this.setState({ timeoutId, value });
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text style={ styles.label }>
          { this.props.label }
        </Text>
        <Switch
          onTintColor={ 'rgba(155, 89, 182, 1.0)' }
          value={ !!this.state.value }
          onValueChange={ this.onValueChange }
        />
      </View>
    );
  }
}

export default SettingsSwitch;

SettingsSwitch.propTypes = {
  value: PropTypes.bool.isRequired,

  setting: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,

  callback: PropTypes.func,
};
