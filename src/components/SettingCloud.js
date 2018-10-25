import _difference from 'lodash/difference';
import _without from 'lodash/without';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SettingCloudItem from './SettingCloudItem';

import { colors } from '../styles';


const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  labelWrapper: {
    marginBottom: 8,
  },
  label: {
    color: colors.darkGray,
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

class SettingCloud extends Component {
  state = {
    values: this.props.values,
    initValues: this.props.values,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (_difference(nextState.values, this.state.values).length) {
      return true;
    }
    if (_difference(this.state.values, nextState.values).length) {
      return true;
    }
    return false;
  }

  handleValueChange = (code, value) => {
    const { radio } = this.props;

    let newValues = this.state.values.slice(0);
    if (value) {
      if (radio) {
        newValues = [code];
      } else {
        newValues.push(code);
      }
    } else if (!radio) {
      newValues = _without(newValues, code);
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

  reset = () => {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }

    this.setState({
      timeoutId: null,
      values: this.state.initValues,
    });
  }

  render() {
    const optionItems = this.props.options.map(option => (
      <SettingCloudItem
        key={ `settingclouditem__${this.props.setting}__${option.code}` }
        value={ this.state.values.includes(option.code) }
        setting={ option.code }
        label={ option.name }
        callback={ this.handleValueChange }
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
  values: PropTypes.array.isRequired,

  radio: PropTypes.bool,

  callback: PropTypes.func,
};

export default SettingCloud;
