import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { reset } from '../actions';

import SWDIcon from './SWDIcon/SWDIcon';

import { cards } from '../lib/Destiny';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 73, 94, 1.0)',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  deckCard: {
    color: 'rgba(255, 255, 255, 1.0)',
    fontSize: 16,
    fontWeight: '500',
  },
  blueCard: {
    color: 'rgba(52, 152, 219, 1.0)',
  },
  redCard: {
    color: 'rgba(231, 76, 60, 1.0)',
  },
  yellowCard: {
    color: 'rgba(241, 196, 15, 1.0)',
  },
  deckInfo: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 13,
  },
});


class SelectedCharacters extends Component {
  constructor(props) {
    super(props);

    this.resetDeck = this.resetDeck.bind(this);
  }

  resetDeck() {
    this.props.reset();
  }

  render() {
    const { deckState } = this.props;

    const characterViews = deckState.get('cards').map(character => {
      const card = cards.get(character.get('id'));

      const characterStyles = [styles.deckCard];

      if (card.faction === 'blue') {
        characterStyles.push(styles.blueCard);
      } else if (card.faction === 'red') {
        characterStyles.push(styles.redCard);
      } else if (card.faction === 'yellow') {
        characterStyles.push(styles.yellowCard);
      }

      return (
        <View key={ card.get('id') }>
          <Text style={ characterStyles }>
            { (character.get('isElite') ? 'e' : '') + card.name + (character.get('count') > 1 ? ` x${character.get('count')}` : '') }
          </Text>
        </View>
      );
    });

    return deckState.get('cards').count() > 0 ? (
      <View style={ styles.container }>
        <View style={{ width: '80%' }}>
          { characterViews }
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'center', width: '20%' }}>
          <TouchableOpacity
          onPress={() => Alert.alert(
            'Clear Characters?',
            'This will reset your selections to allow you to choose different characters and look for different teams.',
            [
              { text: 'Cancel' },
              { text: 'Clear', onPress: () => this.props.reset(), style: 'destructive' },
            ],
          )}>
          <Icon name={ 'trash-o' } size={ 28 } color={ 'rgba(236, 240, 241, 1.0)' } />
        </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={ styles.container }>
        <View style={{ width: '100%' }}>
          <Text style={ styles.deckInfo }>{ 'No Characters Selected' }</Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  deckState: state.deckReducer,
});

const mapDispatchToProps = { reset };

export default connect(mapStateToProps, mapDispatchToProps)(SelectedCharacters);
