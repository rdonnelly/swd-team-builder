import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { CharacterNavigator } from '../navigationConfiguration';
import BadgeTabIcon from '../../../components/BadgeTabIcon';


class CharacterNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Characters',
    tabBarIcon: ({ tintColor, focused }) =>
      <BadgeTabIcon
        iconName="copy"
        size={ 24 }
        color={ tintColor }
        selected={ focused }
        showBadge={ false }
      />,
  }

  render() {
    const { navigationState, dispatch } = this.props;
    return (
      <CharacterNavigator
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

const mapStateToProps = state => ({ navigationState: state.charactersTab });

export default connect(mapStateToProps)(CharacterNavigation);

CharacterNavigation.propTypes = {
  navigationState: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};
