import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

import SWDIcon from './SWDIcon';

import { characterCards } from '../lib/Destiny';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(52, 73, 94, 1.0)',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  characterView: {
    marginVertical: 2,
  },
  characterViewTouchable: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  dice: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
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

    const characterViews = deckState.get('cards').map((character) => {
      const card = characterCards.get(character.get('id'));

      const characterStyles = [styles.deckCard];
      const diceStyles = [styles.dice];

      if (card.faction === 'blue') {
        characterStyles.push(styles.blueCard);
        diceStyles.push(styles.blueCard);
      } else if (card.faction === 'red') {
        characterStyles.push(styles.redCard);
        diceStyles.push(styles.redCard);
      } else if (card.faction === 'yellow') {
        characterStyles.push(styles.yellowCard);
        diceStyles.push(styles.yellowCard);
      }

      const diceIcons = [];
      if (character.get('isElite') !== null) {
        const numDice = character.get('isElite') ? 2 : 1;
        for (let i = 0; i < numDice; i += 1) {
          diceIcons.push(<SWDIcon type={ 'DIE' } font={ 'swdestiny' } style={ diceStyles } />);
        }
      }

      return (
        <View
          key={ card.get('id') }
          style={ styles.characterView }
        >
          <TouchableOpacity
            onPress={ () => this.props.navigate('CharacterDetailScreen', { id: card.get('id') }) }
            style={ styles.characterViewTouchable }
          >
            <Text style={ characterStyles }>
              { card.name + (character.get('count') > 1 ? ` x${character.get('count')}` : '') }
            </Text>
            { diceIcons }
          </TouchableOpacity>
        </View>
      );
    });

    return deckState.get('cards').count() > 0 ? (
      <View style={ styles.container }>
        <View style={{ flex: 1 }}>
          { characterViews }
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
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

const mapDispatchToProps = {
  reset,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectedCharacters);

SelectedCharacters.propTypes = {
  deckState: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
