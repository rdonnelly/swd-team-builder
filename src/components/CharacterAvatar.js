import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';

import SWDIcon from './SWDIcon';

import { characters } from '../lib/Destiny';
import { cardBackTexture, cardImages } from '../lib/DestinyImages';

import { colors } from '../styles';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageContainer: {
    borderColor: colors.gray,
    borderRadius: 4,
    borderWidth: 2,
    overflow: 'hidden',
  },
  imageContainerBorderBlue: {
    borderColor: colors.cardBlue,
  },
  imageContainerBorderRed: {
    borderColor: colors.cardRed,
  },
  imageContainerBorderYellow: {
    borderColor: colors.cardYellow,
  },
  infoContainer: {
    alignItems: 'center',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  diceContainer: {
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingHorizontal: 4,
  },
  die: {
    backgroundColor: colors.transparent,
    color: colors.white,
    fontSize: 12,
    marginVertical: 2,
  },
  countContainer: {
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  count: {
    backgroundColor: colors.transparent,
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
});

class CharacterAvatar extends PureComponent {
  getImageContainerStyles() {
    const { size, numDice, count } = this.props;
    const displaySize = numDice || count ? size : size;

    const imageContainerStyles = {
      height: displaySize,
      width: displaySize,
    };

    if (this.props.round) {
      imageContainerStyles.borderRadius = displaySize / 2;
    }

    return imageContainerStyles;
  }

  getImageStyles() {
    const { size, numDice, count } = this.props;
    const displaySize = numDice || count ? size : size;

    const height = (244 / 100) * displaySize;
    const width = (175 / 100) * displaySize;

    const left = (-38 / 100) * displaySize;
    const top = (-36 / 100) * displaySize;

    return {
      height,
      width,
      left,
      top,
    };
  }

  render() {
    const { cardId, numDice, count } = this.props;
    const card = characters[cardId];

    const imageSrc = cardImages[cardId] || null;

    const containerStyles = [styles.container];
    const imageContainerStyles = [
      styles.imageContainer,
      this.getImageContainerStyles(),
    ];
    const imageStyles = [this.getImageStyles()];
    const dieStyles = [styles.die];
    const countStyles = [styles.count];

    if (card.faction === 'blue') {
      imageContainerStyles.push(styles.imageContainerBorderBlue);
      countStyles.push({ color: colors.blue });
      dieStyles.push({ color: colors.blue });
    }
    if (card.faction === 'red') {
      imageContainerStyles.push(styles.imageContainerBorderRed);
      countStyles.push({ color: colors.red });
      dieStyles.push({ color: colors.red });
    }
    if (card.faction === 'yellow') {
      imageContainerStyles.push(styles.imageContainerBorderYellow);
      countStyles.push({ color: colors.yellow });
      dieStyles.push({ color: colors.yellow });
    }

    const diceIcons = [];
    if (numDice) {
      for (let i = 0; i < numDice; i += 1) {
        diceIcons.push(
          <SWDIcon
            key={`avatar_die___${cardId}___${i}`}
            style={dieStyles}
            type={'DIE'}
          />,
        );
      }
    }

    const countText =
      count > 1 ? <Text style={countStyles}>{count}</Text> : null;

    const infoContainer =
      diceIcons.length || countText ? (
        <View style={styles.infoContainer}>
          {diceIcons.length ? (
            <View style={styles.diceContainer}>{diceIcons}</View>
          ) : null}
          {countText ? (
            <View style={styles.countContainer}>{countText}</View>
          ) : null}
        </View>
      ) : null;

    return (
      <View style={containerStyles}>
        <View style={imageContainerStyles}>
          <Image
            source={imageSrc}
            defaultSource={cardBackTexture}
            style={imageStyles}
          />
        </View>
        {infoContainer}
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
