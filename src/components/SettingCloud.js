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
      props.values :
      this.props.options.reduce((values, option) => ({
        [option.code]: true,
        ...values,
      }), {});

    this.state = {
      values: { ...initialValues },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.values === nextState.values) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.values !== prevState.values) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.props.callback(this.props.setting, this.state.values);
      }, INTERACTION_DELAY);
    }
  }

  updateValues = (nextValues) => {
    this.setState({
      values: { ...nextValues },
    });
  }

  handlePressItem = (code) => {
    ReactNativeHapticFeedback.trigger('selection');

    this.setState((state) => {
      const newValues = {
        ...state.values,
      };

      if (this.props.radio) {
        Object.keys(newValues).forEach((key) => {
          newValues[key] = false;
        });

        newValues[code] = true;
      } else {
        newValues[code] = !newValues[code];
      }

      return {
        ...state,
        values: newValues,
      };
    });
  }

  handleLongPressItem = (code) => {
    ReactNativeHapticFeedback.trigger('impactHeavy');

    this.setState((state) => {
      const newValues = {
        ...state.values,
      };

      Object.keys(newValues).forEach((key) => {
        newValues[key] = false;
      });

      newValues[code] = true;

      return {
        ...state,
        values: newValues,
      };
    });
  }

  selectAll = () => {
    ReactNativeHapticFeedback.trigger('selection');

    this.reset();
  }

  selectNone = () => {
    ReactNativeHapticFeedback.trigger('selection');

    this.setState((state) => {
      const newValues = {
        ...state.values,
      };

      Object.keys(newValues).forEach((key) => {
        newValues[key] = false;
      });

      return {
        ...state,
        values: newValues,
      };
    });
  }

  reset = () => {
    this.setState((state) => {
      const newValues = {
        ...state.values,
      };

      Object.keys(newValues).forEach((key) => {
        newValues[key] = true;
      });

      return {
        ...state,
        values: newValues,
      };
    });
  }

  render() {
    const optionItems = this.props.options.map((option) => (
      <SettingCloudItem
        key={ `settingclouditem__${this.props.setting}__${option.code}` }
        code={ option.code }
        value={ this.state.values[option.code] }
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
  values: PropTypes.object,

  radio: PropTypes.bool,

  callback: PropTypes.func,
};

export default SettingCloud;
