import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SWDIcon from '../components/SWDIcon';

import { characters } from '../lib/Destiny';
import { cardBackTexture, cardImages } from '../lib/DestinyImages';

import { colors } from '../styles';


const styles = StyleSheet.create({
  container: {
    borderColor: colors.gray,
    borderRadius: 4,
    borderWidth: 2,
    height: 72,
    overflow: 'hidden',
    width: 72,
  },
  blueBorder: {
    borderColor: colors.cardBlue,
  },
  redBorder: {
    borderColor: colors.cardRed,
  },
  yellowBorder: {
    borderColor: colors.cardYellow,
  },
  infoContainer: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  diceContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  die: {
    backgroundColor: 'transparent',
    color: colors.white,
    fontSize: 14,
    marginRight: 4,
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
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
});

class CharacterAvatar extends PureComponent {
  getContainerStyles() {
    const containerStyles = {
      height: this.props.size,
      width: this.props.size,
    };

    if (this.props.round) {
      containerStyles.borderRadius = this.props.size / 2;
    }

    return containerStyles;
  }

  getImageStyles() {
    const height = (244 / 100) * this.props.size;
    const width = (175 / 100) * this.props.size;

    const left = (-38 / 100) * this.props.size;
    const top = (-36 / 100) * this.props.size;

    return {
      height, width, left, top,
    };
  }

  render() {
    const { cardId, numDice, count } = this.props;
    const card = characters[cardId];

    const containerStyles = [styles.container, this.getContainerStyles()];
    const imageStyles = [styles.image, this.getImageStyles()];

    if (card.faction === 'blue') {
      containerStyles.push(styles.blueBorder);
    }
    if (card.faction === 'red') {
      containerStyles.push(styles.redBorder);
    }
    if (card.faction === 'yellow') {
      containerStyles.push(styles.yellowBorder);
    }

    const diceIcons = [];
    if (numDice) {
      for (let i = 0; i < numDice; i += 1) {
        diceIcons.push(
          <SWDIcon
            key={ `avatar_die___${cardId}___${i}` }
            font={ 'swdestiny' }
            style={ styles.die }
            type={ 'DIE' }
          />,
        );
      }
    }

    const countText = count > 1 ?
      <Text style={ styles.count }>
        x{ count }
      </Text> : null;

    const imageSrc = cardImages[cardId] || null;

    return (
      <View style={ containerStyles }>
        <Image
          source={ imageSrc }
          defaultSource={ cardBackTexture }
          style={ imageStyles }
        />
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
  cardId: PropTypes.string.isRequired,

  size: PropTypes.number.isRequired,
  round: PropTypes.bool.isRequired,

  numDice: PropTypes.number,
  count: PropTypes.number,
};
