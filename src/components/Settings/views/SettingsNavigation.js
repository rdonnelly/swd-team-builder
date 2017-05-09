import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { SettingsNavigator } from '../navigationConfiguration';
import BadgeTabIcon from '../../BadgeTabIcon/BadgeTabIcon';


class SettingsNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ tintColor, focused }) => {
      return (
        <BadgeTabIcon
          iconName="cog"
          size={ 24 }
          color={ tintColor }
          selected={ focused }
          showBadge={ false }
        />
      );
    },
  }

  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <SettingsNavigator
        navigation={
          addNavigationHelpers({
            dispatch,
            state: navigationState,
          })
        }
      />
    );
  }
}

const mapStateToProps = state => ({ navigationState: state.settingsTab });

export default connect(mapStateToProps)(SettingsNavigation);
