import React, { PureComponent } from 'react';
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

import SWDIcon from './SWDIcon';

import { reset } from '../actions';
import { getDeckCharacters } from '../selectors/deckSelectors';

import { characters } from '../lib/Destiny';

import { colors } from '../styles';


export const ITEM_HEIGHT = 42;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    borderRadius: 4,
    flexDirection: 'row',
    paddingHorizontal: 16,
    width: '100%',
  },
  item: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: ITEM_HEIGHT,
  },
  characterViews: {
    flex: 1,
  },
  characterViewTouchable: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  deckCard: {
    color: colors.lightGrayDark,
    fontSize: 16,
    fontWeight: '700',
  },
  blueCard: {
    color: colors.cardBlue,
  },
  redCard: {
    color: colors.cardRed,
  },
  yellowCard: {
    color: colors.cardYellow,
  },
  dice: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  deckInfo: {
    color: colors.lightGray,
    fontSize: 14,
    fontWeight: '600',
  },
});


class SelectedCharacters extends PureComponent {
  constructor(props) {
    super(props);

    this.resetDeck = this.resetDeck.bind(this);
  }

  resetDeck() {
    this.props.reset();
  }

  render() {
    const { deckCharacterObjects } = this.props;

    const characterViews = deckCharacterObjects.map((characterObject) => {
      const card = characters[characterObject.id];

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
      for (let i = 0; i < characterObject.numDice; i += 1) {
        diceIcons.push(
          <SWDIcon
            key={ `die__${card.id}__${i}` }
            type={ 'DIE' }
            font={ 'swdestiny' }
            style={ diceStyles }
          />,
        );
      }

      return (
          <TouchableOpacity
            onPress={ () => this.props.navigate('CharacterDetailScreen', { id: card.id }) }
            key={ `character__${card.id}` }
            style={ styles.item }
          >
            <Text style={ characterStyles }>
              { card.name + (characterObject.count > 1 ? ` x${characterObject.count}` : '') }
            </Text>
            { diceIcons }
          </TouchableOpacity>
      );
    });

    return deckCharacterObjects.length ? (
      <View style={ styles.container }>
        <View style={ styles.characterViews }>
          { characterViews }
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{ padding: 4 }}
            onPress={() => Alert.alert(
              'Clear Characters?',
              'This will reset your selections to allow you to choose different characters and look for different teams.',
              [
                { text: 'Cancel' },
                { text: 'Clear', onPress: () => this.props.reset(), style: 'destructive' },
              ],
            )}
          >
            <Icon name={ 'trash-o' } size={ 24 } color={ colors.lightGray } />
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={ styles.container }>
        <View style={ styles.item }>
          <Text style={ styles.deckInfo }>{ 'No Characters Selected' }</Text>
        </View>
      </View>
    );
  }
}

SelectedCharacters.propTypes = {
  deckCharacterObjects: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  deckCharacterObjects: getDeckCharacters(state),
});

const mapDispatchToProps = {
  reset,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectedCharacters);
