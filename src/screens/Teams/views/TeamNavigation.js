import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { TeamNavigator } from '../navigationConfiguration';
import BadgeTabIcon from '../../../components/BadgeTabIcon';


class TeamNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Teams',
    tabBarIcon: ({ tintColor, focused }) =>
      <BadgeTabIcon
        iconName="list"
        size={ 30 }
        color={ tintColor }
        selected={ focused }
        showBadge={ true }
      />,
  }

  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <TeamNavigator
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

export default connect(mapStateToProps)(TeamNavigation);

TeamNavigation.propTypes = {
  navigationState: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};
