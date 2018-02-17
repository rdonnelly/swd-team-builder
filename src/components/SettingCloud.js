import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Immutable from 'immutable';

import SettingCloudItem from './SettingCloudItem';


const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  labelWrapper: {
    marginBottom: 8,
  },
  label: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 20,
    fontWeight: '800',
  },
  optionsWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

class SettingCloud extends PureComponent {
  static defaultProps = {
    value: true,
  };

  state = {
    values: this.props.values,
  };

  constructor(props) {
    super(props);

    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(code, value) {
    let newValues = this.state.values;
    if (value) {
      newValues = newValues.push(code);
    } else {
      newValues = newValues.filterNot(setCode => setCode === code);
    }

    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      this.props.callback(this.props.setting, this.state.values);
      this.setState({ timeoutId: null });
    }, 750);

    this.setState({
      timeoutId,
      values: newValues,
    });
  }

  render() {
    const optionItems = this.props.options.map(option => (
      <SettingCloudItem
        key={ `settingclouditem__${this.props.setting}__${option.code}` }
        value={ this.props.values.includes(option.code) }
        setting={ option.code }
        label={ option.name }
        callback={ this.onValueChange }
      />
    ));

    return (
      <View style={ styles.container }>
        <View style={ styles.labelWrapper }>
          <Text style={ styles.label }>
            { this.props.label }
          </Text>
        </View>
        <View style={ styles.optionsWrapper }>
          { optionItems }
        </View>
      </View>
    );
  }
}

SettingCloud.propTypes = {
  label: PropTypes.string.isRequired,
  setting: PropTypes.string.isRequired,

  options: PropTypes.array.isRequired,
  values: PropTypes.instanceOf(Immutable.List),

  callback: PropTypes.func,
};

export default SettingCloud;
