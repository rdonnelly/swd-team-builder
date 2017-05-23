import React, { Component } from 'react';
import {
  ActionSheetIOS,
  Button,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import { connect } from 'react-redux';

import { updateSort } from '../../../actions';

import { cards } from '../../../lib/Destiny';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'Teams',
      headerRight: (
        <Button
          title={ 'Sort' }
          color={ 'rgba(155, 89, 182, 1.0)' }
          onPress={ () => { state.params.showSortActionSheet(); } }
        />
      ),
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({
      showSortActionSheet: this.showSortActionSheet.bind(this),
    });
  }

  renderItem({ item: team }) {
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
          <Text style={ styles.teamStat }>{ team.get('dice') } Dice</Text>
          <Text style={ styles.teamStat }>&middot;</Text>
          <Text style={ styles.teamStat }>{ team.get('health') } Health</Text>
          <Text style={ styles.teamStat }>&middot;</Text>
          <Text style={ styles.teamStat }>{ team.get('points') } Points</Text>
          <Text style={ styles.teamStat }>&middot;</Text>
          <Text style={ styles.teamStat }>{ team.get('affiliation').charAt(0).toUpperCase() + team.get('affiliation').slice(1) }</Text>
        </View>
      </View>
    );
  }

  render() {
    const { teamsState } = this.props;

    const list = teamsState.get('teams').count() ? (
      <VirtualizedList
        style={ styles.list }
        data={ teamsState.get('teams') }
        renderItem={ this.renderItem }
        getItem={ (data, key) => (data.get ? data.get(key) : data[key]) }
        getItemCount={ data => (data.size || data.count || 0) }
        keyExtractor={ (item, index) => String(index) }
      />
    ) : (
      <View style={{ width: '80%' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgba(149, 165, 166, 1.0)', fontSize: 24, fontWeight: '700', textAlign: 'center' }}>No Teams Found</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgba(149, 165, 166, 1.0)', textAlign: 'center' }}>Try changing your characters or adjusting your settings.</Text>
        </View>
      </View>
    );

    return (
      <View style={ styles.container }>
        { list }
      </View>
    );
  }

  showSortActionSheet() {
    const options = [
      'Sort By Dice',
      'Sort By Health',
      'Sort By Points',
      'Cancel',
    ];

    ActionSheetIOS.showActionSheetWithOptions({
      options,
      cancelButtonIndex: 3,
      tintColor: 'rgba(155, 89, 182, 1.0)',
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0: // dice
          this.props.updateSort('dice');
          break;
        case 1: // health
          this.props.updateSort('health');
          break;
        case 2: // points
          this.props.updateSort('points');
          break;
        default:
          break;
      }
    });
  };
}

const mapStateToProps = state => ({
  teamsState: state.teamsReducer,
});

const mapDispatchToProps = { updateSort };

export default connect(mapStateToProps, mapDispatchToProps)(TeamsView);
