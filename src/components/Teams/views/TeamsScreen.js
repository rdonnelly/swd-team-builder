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
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
  },
  list: {
    width: '100%',
  },
  row: {
    padding: 12,
  },
  characterNameWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  characterName: {
    fontSize: 18,
    paddingRight: 8,
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
  teamStat: {
    fontSize: 12,
    paddingRight: 8,
  },
});

class TeamsView extends Component {
  static navigationOptions = {
    title: 'Teams',
  }

  renderRow(team) {
    const charactersView = team.get('characters').map((character) => {
      const card = cards.get(character.get('id'));
      const cardStyles = [styles.characterName];

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
        <Text key={ `${team.get('key')}___${character.get('id')}` } style={ cardStyles }>
          { (character.get('isElite') ? 'e' : '') + card.name + (character.get('count') > 1 ? ` x${character.get('count')}` : '') }
        </Text>
      );
    });

    return (
      <View style={ styles.row }>
        <View style={ styles.characterNameWrapper }>
          { charactersView }
        </View>
        <View style={ styles.characterNameWrapper }>
          <Text style={ styles.teamStat }>Points: { team.get('points') }</Text>
          <Text style={ styles.teamStat }>Dice: { team.get('dice') }</Text>
          <Text style={ styles.teamStat }>Health: { team.get('health') }</Text>
          <Text style={ styles.teamStat }>Affiliation: { team.get('affiliation').charAt(0).toUpperCase() + team.get('affiliation').slice(1) }</Text>
        </View>
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
