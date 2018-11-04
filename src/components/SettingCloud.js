import _difference from 'lodash/difference';
import _without from 'lodash/without';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import SettingCloudItem from './SettingCloudItem';

import { colors } from '../styles';


const INTERACTION_DELAY = 750;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  labelWrapper: {
    marginRight: 8,
  },
  label: {
    color: colors.darkGray,
    fontSize: 20,
    fontWeight: '800',
  },
  controlsWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  control: {
    backgroundColor: colors.lightGrayTranslucent,
    borderRadius: 4,
    paddingVertical: 4,
    marginLeft: 8,
    width: 48,
  },
  controlText: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

class SettingCloud extends Component {
  static defaultProps = {
    radio: false,
    values: null,
  };

  constructor(props) {
    super(props);

    this.timeoutId = null;

    const initialValues = props.values !== null ?
      props.values : this.props.options.map(option => option.code);

    this.state = {
      initialValues,
      values: initialValues,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (_difference(nextState.values, this.state.values).length) {
      return true;
    }
    if (_difference(this.state.values, nextState.values).length) {
      return true;
    }
    return false;
  }

  updateValues = (nextValues) => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.props.callback(this.props.setting, nextValues);
    }, INTERACTION_DELAY);

    this.setState({
      values: nextValues,
    });
  }

  handlePressItem = (code, value) => {
    ReactNativeHapticFeedback.trigger('selection');

    let nextValues = [...this.state.values];
    if (value) {
      if (this.props.radio) {
        nextValues = [code];
      } else {
        nextValues.push(code);
      }
    } else if (!this.props.radio) {
      nextValues = _without(nextValues, code);
    }

    this.updateValues(nextValues);
  }

  handleLongPressItem = (code) => {
    ReactNativeHapticFeedback.trigger('impactHeavy');

    const nextValues = [code];
    this.updateValues(nextValues);
  }

  selectAll = () => {
    ReactNativeHapticFeedback.trigger('selection');

    this.reset();
  }

  selectNone = () => {
    ReactNativeHapticFeedback.trigger('selection');

    const nextValues = [];
    this.updateValues(nextValues);
  }

  reset = () => {
    const nextValues = [...this.state.initialValues];
    this.updateValues(nextValues);
  }

  render() {
    const optionItems = this.props.options.map(option => (
      <SettingCloudItem
        key={ `settingclouditem__${this.props.setting}__${option.code}` }
        value={ this.state.values.includes(option.code) }
        setting={ option.code }
        label={ option.name }
        handlePress={ this.handlePressItem }
        handleLongPress={ this.handleLongPressItem }
      />
    ));

    return (
      <View style={ styles.container }>
        <View style={ styles.header }>
          <View style={ styles.labelWrapper }>
            <Text style={ styles.label }>
              { this.props.label }
            </Text>
          </View>
          { !this.props.radio &&
            <View style={ styles.controlsWrapper }>
              <TouchableOpacity
                onPress={ this.selectAll }
                style={ styles.control }
              >
                <Text style={ styles.controlText }>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={ this.selectNone }
                style={ styles.control }
              >
                <Text style={ styles.controlText }>None</Text>
              </TouchableOpacity>
            </View>
          }
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
  values: PropTypes.array,

  radio: PropTypes.bool,

  callback: PropTypes.func,
};

export default SettingCloud;
