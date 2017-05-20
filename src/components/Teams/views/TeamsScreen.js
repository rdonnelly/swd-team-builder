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
  teamCharactersWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  characterIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  characterName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 20,
    marginRight: 8,
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
  teamInfoWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  teamStat: {
    color: 'rgba(149, 165, 166, 1.0)',
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
      const cardIconStyles = [styles.characterIcon];
      const cardNameStyles = [styles.characterName];

      switch (card.faction) {
        case 'blue':
          cardIconStyles.push(styles.blueCard);
          cardNameStyles.push(styles.blueCard);
          break;
        case 'red':
          cardIconStyles.push(styles.redCard);
          cardNameStyles.push(styles.redCard);
          break;
        case 'yellow':
          cardIconStyles.push(styles.yellowCard);
          cardNameStyles.push(styles.yellowCard);
          break;
      }

      return (
        <View key={ `${team.get('key')}___${character.get('id')}` }>
          <Text style={ cardNameStyles }>
            { (character.get('isElite') ? 'e' : '') + card.name + (character.get('count') > 1 ? ` x${character.get('count')}` : '') }
          </Text>
        </View>
      );
    });

    return (
      <View style={ styles.row }>
        <View style={ styles.teamCharactersWrapper }>
          { charactersView }
        </View>
        <View style={ styles.teamInfoWrapper }>
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
