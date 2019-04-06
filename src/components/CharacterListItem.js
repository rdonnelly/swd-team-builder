import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Swipeable from 'react-native-swipeable';
import { withNavigation } from 'react-navigation';

import CharacterAvatar from './CharacterAvatar';
import { validateCode } from '../lib/SWDIconCodes';
import SWDIcon from './SWDIcon';

import { base as baseStyles, colors } from '../styles';

import {
  includeCharacter,
  excludeCharacter,
} from '../store/actions';
import { characters } from '../lib/Destiny';

export const ITEM_HEIGHT = 72;

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderBottomColor: colors.lightGrayDark,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.lightGray,
    borderLeftWidth: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: ITEM_HEIGHT,
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 12,
  },
  excludedRow: {
    borderLeftColor: colors.orange,
  },
  incompatibleRow: {
    borderLeftColor: colors.gray,
  },
  cardAvatarWrapper: {
    alignItems: 'center',
    marginRight: 10,
    width: 42,
  },
  incompatibleCardAvatarWrapper: {
    opacity: 0.4,
  },
  content: {
    flex: 1,
  },
  cardNameWrapper: {
    ...baseStyles.row,
  },
  cardName: {
    color: colors.darkGray,
    fontSize: 20,
  },
  incompatibleCardName: {
    color: colors.lightGrayDark,
  },
  cardUnique: {
    color: colors.gray,
    fontSize: 16,
  },
  incompatibleCardUnique: {
    color: colors.lightGrayDark,
  },
  cardInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardInfoLogo: {
    color: colors.gray,
    fontSize: 10,
  },
  incompatibleCardInfoLogo: {
    color: colors.lightGrayDark,
  },
  cardInfoData: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: '500',
  },
  incompatibleCardInfoData: {
    color: colors.lightGrayDark,
  },
  arrow: {
    color: colors.gray,
    marginTop: 2,
    textAlign: 'right',
  },
  arrowIncompatible: {
    color: colors.lightGrayDark,
  },
  rightSwipeItem: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  rightSwipeItemText: {
    color: colors.white,
  },
});

class CharacterListItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.characterId === nextProps.characterId &&
        this.props.characterIsExcluded === nextProps.characterIsExcluded &&
        this.props.characterIsIncompatible === nextProps.characterIsIncompatible) {
      return false;
    }

    return true;
  }

  navigateToCharacterDetails = (characterId) => () => {
    this.props.navigation.navigate('CharacterDetailScreen', { id: characterId });
  }

  render() {
    const {
      characterId,
      characterIsExcluded,
      characterIsIncompatible,
      onOpen,
      onClose,
    } = this.props;

    const card = characters[characterId];

    const rowStyles = [styles.row];
    const cardAvatarStyles = [styles.cardAvatarWrapper];
    const cardNameStyle = [styles.cardName];
    const cardUniqueStyle = [styles.cardUnique];
    const cardInfoDataStyle = [styles.cardInfoData];
    const cardInfoLogoStyle = [styles.cardInfoLogo];
    const arrowStyle = [styles.arrow];

    if (characterIsIncompatible || characterIsExcluded) {
      rowStyles.push(styles.incompatibleRow);
      cardAvatarStyles.push(styles.incompatibleCardAvatarWrapper);
      cardNameStyle.push(styles.incompatibleCardName);
      cardUniqueStyle.push(styles.incompatibleCardUnique);
      cardInfoDataStyle.push(styles.incompatibleCardInfoData);
      cardInfoLogoStyle.push(styles.incompatibleCardInfoLogo);
      arrowStyle.push(styles.arrowIncompatible);
    }

    if (characterIsExcluded) {
      rowStyles.push(styles.excludedRow);
    }

    const setIcon = validateCode(card.set) ? (
      <SWDIcon type={ card.set } style={ cardInfoLogoStyle } />
    ) : null;

    const subtitle = card.subtitle ? (
      <Text style={ cardInfoDataStyle }>{ card.subtitle }</Text>
    ) : null;

    const pointsArray = [card.pointsRegular];
    if (card.pointsElite) {
      pointsArray.push(card.pointsElite);
    }
    const points = pointsArray ? (
      <Text style={ cardInfoDataStyle }>{ pointsArray.join('/') }</Text>
    ) : null;

    const cardInfo = (
      <View style={ styles.cardInfo }>
        { setIcon &&
          <View style={ styles.cardInfo }>
            { setIcon }
            <Text style={ cardInfoDataStyle }>&nbsp;</Text>
          </View>
        }
        { subtitle &&
          <View style={ styles.cardInfo }>
            { subtitle }
          </View>
        }
        { points &&
          <View style={ styles.cardInfo }>
            <Text style={ cardInfoDataStyle }>&nbsp;&middot;&nbsp;</Text>
            { points }
          </View>
        }
      </View>
    );

    const uniqueIcon = card.isUnique ? (
      <SWDIcon type={ 'UNIQUE' } style={ cardUniqueStyle } />
    ) : null;

    const avatar = (
      <View style={ cardAvatarStyles }>
        <CharacterAvatar
          cardId={ characterId }
          round={ true }
          size={ StyleSheet.flatten(styles.cardAvatarWrapper).width }
        />
      </View>
    );

    const rightButtons = characterIsExcluded ? [
      <TouchableHighlight
        key={ 'right-button-include' }
        activeOpacity={ 0.9 }
        style={[styles.rightSwipeItem, { backgroundColor: colors.orange }]}
        underlayColor={ colors.orangeDark }
        onPress={ () => {
          this.swipeable.recenter();
          setTimeout(() => {
            this.props.includeCharacter(characterId);
          }, 250);
        } }
      >
        <Text style={ styles.rightSwipeItemText }>Include</Text>
      </TouchableHighlight>,
    ] : [
      <TouchableHighlight
        key={ 'right-button-exclude' }
        activeOpacity={ 0.9 }
        style={[styles.rightSwipeItem, { backgroundColor: colors.orange }]}
        underlayColor={ colors.orangeDark }
        onPress={ () => {
          this.swipeable.recenter();
          setTimeout(() => {
            this.props.excludeCharacter(characterId);
          }, 250);
        } }
      >
        <Text style={ styles.rightSwipeItemText }>Exclude</Text>
      </TouchableHighlight>,
    ];

    return (
      <Swipeable
        rightButtons={ rightButtons }
        onRef={ (component) => { this.swipeable = component; } }
        onRightButtonsOpenRelease={ onOpen }
        onRightButtonsCloseRelease={ onClose }
      >
        <TouchableHighlight
          activeOpacity={ 0.4 }
          underlayColor={ colors.lightGray }
          onPress={ this.navigateToCharacterDetails(characterId) }
        >
          <View style={ rowStyles }>
            <View>
              { avatar }
            </View>
            <View style={ styles.content }>
              <View style={ styles.cardNameWrapper }>
                <Text numberOfLines={ 1 }>
                  <Text style={ cardNameStyle }>{ card.name }</Text>
                  <Text style={ cardNameStyle }>&nbsp;</Text>
                  <Text style={ cardNameStyle }>{ uniqueIcon }</Text>
                </Text>
              </View>
              { cardInfo }
            </View>
            <View>
              <FontAwesome5Icon name={ 'chevron-right' } size={ 16 } style={ arrowStyle } />
            </View>
          </View>
        </TouchableHighlight>
      </Swipeable>
    );
  }
}

CharacterListItem.propTypes = {
  characterId: PropTypes.string.isRequired,
  characterIsExcluded: PropTypes.bool,
  characterIsIncompatible: PropTypes.bool,
  navigation: PropTypes.object.isRequired,

  includeCharacter: PropTypes.func.isRequired,
  excludeCharacter: PropTypes.func.isRequired,

  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  includeCharacter,
  excludeCharacter,
};

export default withNavigation(connect(
  null,
  mapDispatchToProps,
)(CharacterListItem));
