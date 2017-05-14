import React, { Component } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

class SettingsSwitch extends Component {
  static defaultProps = {
    value: 0,
  };

  state = {
    value: this.props.value,
  };

  constructor(props) {
    super(props);

    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    this.setState({ value });
    this.props.callback(this.props.setting, value);
  }

  render() {
    return (
      <View style={ styles.container }>
        <Text>{ `${this.props.label}: ${this.state.value ? 'Yes' : 'No'}` }</Text>
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
  value: React.PropTypes.number.isRequired,

  setting: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,

  callback: React.PropTypes.func,
};
