import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SWDIcon from '../components/SWDIcon';

import { cards } from '../lib/Destiny';
import { cardImages } from '../lib/DestinyImages';

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 2,
    height: 72,
    marginHorizontal: 8,
    overflow: 'hidden',
    width: 72,
  },
  blueCard: {
    borderColor: 'rgba(52, 152, 219,1.0)',
  },
  redCard: {
    borderColor: 'rgba(231, 76, 60,1.0)',
  },
  yellowCard: {
    borderColor: 'rgba(241, 196, 15,1.0)',
  },
  imageContainer: {
    top: -24,
    left: -20,
  },
  image: {
    height: 156,
    width: 112,
  },
  infoContainer: {
    alignItems: 'center',
    bottom: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 4,
    position: 'absolute',
    right: 4,
  },
  diceContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  die: {
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: 14,
    marginRight: 4,
  },
  blueDie: {
    color: 'rgba(52, 152, 219,1.0)',
  },
  redDie: {
    color: 'rgba(231, 76, 60,1.0)',
  },
  yellowDie: {
    color: 'rgba(241, 196, 15,1.0)',
  },
  countContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  count: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 1.0)',
    fontSize: 15,
    fontWeight: '900',
  },
  blueCount: {
    color: 'rgba(52, 152, 219,1.0)',
  },
  redCount: {
    color: 'rgba(231, 76, 60,1.0)',
  },
  yellowCount: {
    color: 'rgba(241, 196, 15,1.0)',
  },
});

class CharacterAvatar extends Component {

  render() {
    const { cardId, isElite, count } = this.props;
    const card = cards.get(cardId);

    const containerStyles = [styles.container];
    const dieStyles = [styles.die];
    const countStyles = [styles.count];

    if (card.faction === 'blue') {
      containerStyles.push(styles.blueCard);
      dieStyles.push(styles.blueDie);
      countStyles.push(styles.blueCount);
    }
    if (card.faction === 'red') {
      containerStyles.push(styles.redCard);
      dieStyles.push(styles.redDie);
      countStyles.push(styles.redCount);
    }
    if (card.faction === 'yellow') {
      containerStyles.push(styles.yellowCard);
      dieStyles.push(styles.yellowDie);
      countStyles.push(styles.yellowCount);
    }

    const diceIcons = [];
    if (isElite !== null) {
      const numDice = isElite ? 2 : 1;
      for (let i = 0; i < numDice; i += 1) {
        diceIcons.push(
          <SWDIcon
            font={ 'swdestiny' }
            style={ dieStyles }
            type={ 'DIE' }
          />,
        );
      }
    }

    const countText = count > 1 ?
      <Text style={ countStyles }>
        x{ count }
      </Text> : null;

    return (
      <View style={ containerStyles }>
        <View style={ styles.imageContainer }>
          <Image
            style={ styles.image }
            source={ cardImages.get(card.get('id')) }
          />
        </View>
        <View style={ styles.infoContainer }>
          <View style={ styles.diceContainer }>
            { diceIcons }
          </View>
          <View style={ styles.countContainer }>
            { countText }
          </View>
        </View>
      </View>
    );
  }
}

export default CharacterAvatar;

CharacterAvatar.propTypes = {
  cardId: React.PropTypes.string.isRequired,
  isElite: React.PropTypes.bool.isRequired,
  count: React.PropTypes.number.isRequired,
};
