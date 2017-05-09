import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { CharactersNavigator } from '../navigationConfiguration';
import BadgeTabIcon from '../../BadgeTabIcon/BadgeTabIcon';


class CharactersNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Characters',
    tabBarIcon: ({ tintColor, focused }) => {
      return (
        <BadgeTabIcon
          iconName="copy"
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
      <CharactersNavigator
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

export default connect(mapStateToProps)(CharactersNavigation);
