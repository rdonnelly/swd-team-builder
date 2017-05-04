import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import ImmutableVirtualListView from 'react-native-immutable-list-view';

import { cards } from '../../../lib/Destiny';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  list: {
    width: '100%',
  },
  row: {
    padding: 10,
  },
  blueCard: {
    color: 'rgba(52, 152, 219,1.0)',
  },
  redCard: {
    color: 'rgba(231, 76, 60,1.0)',
  },
  yellowCard: {
    color: 'rgba(241, 196, 15,1.0)',
  },
});

class TeamsView extends Component {
  static navigationOptions = {
    title: 'Teams',
  }

  renderRow(team) {
    const charactersView = team.get('characters').map((character) => {
      const card = cards.get(character.get('id'));
      const cardStyles = [];

      switch (card.faction) {
        case 'blue':
          cardStyles.push(styles.blueCard);
          break;
        case 'red':
          cardStyles.push(styles.redCard);
          break;
        case 'yellow':
          cardStyles.push(styles.yellowCard);
          break;
      }

      return (
        <Text style={cardStyles}>
          { (character.get('isElite') ? 'e' : '') + card.name + (character.get('count') > 1 ? ' x' + character.get('count') : '') }
        </Text>
      );
    });

    return (
      <View style={styles.row}>
        { charactersView }
      </View>
    );
  }

  render() {
    const { teamsState } = this.props;

    return (
      <View style={ styles.container }>
        <ImmutableVirtualListView
          style={ styles.list}
          immutableData={ teamsState.get('teams') }
          renderRow={ this.renderRow }
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  teamsState: state.teamsReducer,
});

export default connect(mapStateToProps)(TeamsView);
