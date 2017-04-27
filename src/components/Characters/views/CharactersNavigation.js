import React from 'react';
import { addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';

import { CharactersNavigator } from '../navigationConfiguration';


class CharactersNavigation extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Characters',
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
