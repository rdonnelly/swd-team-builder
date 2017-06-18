import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { TeamsNavigator } from '../navigationConfiguration';
import BadgeTabIcon from '../../BadgeTabIcon/BadgeTabIcon';


class TeamsNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Teams',
    tabBarIcon: ({ tintColor, focused }) => (
      <BadgeTabIcon
        iconName="list"
        size={ 30 }
        color={ tintColor }
        selected={ focused }
        showBadge={ true }
      />
    ),
  }

  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <TeamsNavigator
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

const mapStateToProps = state => ({
  navigationState: state.teamsTab,
});

export default connect(mapStateToProps)(TeamsNavigation);
