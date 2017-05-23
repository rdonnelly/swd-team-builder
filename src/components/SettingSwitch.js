import React, { Component } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{ this.props.label }</Text>
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
