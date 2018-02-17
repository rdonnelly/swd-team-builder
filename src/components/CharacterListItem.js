import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import Swipeable from 'react-native-swipeable';
import Immutable from 'immutable';

import CharacterAvatar from '../components/CharacterAvatar';
import { validate as validateIcon, swdestiny as swdIcons } from '../lib/swd-icons';
import SWDIcon from '../components/SWDIcon';

import {
  includeCharacter,
  excludeCharacter,
} from '../actions';
import { characters } from '../lib/Destiny';

export const ITEM_HEIGHT = 67;

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(236, 240, 241, 1.0)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(189, 195, 199, 1.0)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: ITEM_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  excludedRow: {
    borderLeftColor: 'rgba(230, 126, 34, 1.0)',
  },
  incompatibleRow: {
    borderLeftColor: 'rgba(149, 165, 166, 1.0)',
  },
  cardAvatarWrapper: {
    alignItems: 'center',
    marginRight: 10,
    width: 42,
  },
  incompatibleCardAvatarWrapper: {
    opacity: 0.4,
  },
  cardName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 20,
  },
  incompatibleCardName: {
    color: 'rgba(189, 195, 199, 1.0)',
  },
  cardUnique: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 16,
  },
  incompatibleCardUnique: {
    color: 'rgba(189, 195, 199, 1.0)',
  },
  cardInfo: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 13,
    fontWeight: '500',
  },
  incompatibleCardInfo: {
    color: 'rgba(189, 195, 199, 1.0)',
  },
  cardInfoLogo: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 10,
  },
  incompatibleCardInfoLogo: {
    color: 'rgba(189, 195, 199, 1.0)',
  },
  blueCard: {
    borderColor: 'rgba(52, 152, 219, 1.0)',
  },
  redCard: {
    borderColor: 'rgba(231, 76, 60, 1.0)',
  },
  yellowCard: {
    borderColor: 'rgba(241, 196, 15, 1.0)',
  },
  arrow: {
    color: 'rgba(149, 165, 166, 1.0)',
    marginTop: 2,
  },
  arrowIncompatible: {
    color: 'rgba(189, 195, 199, 1.0)',
  },
  rightSwipeItem: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  rightSwipeItemText: {
    color: 'rgba(255, 255, 255, 1.0)',
  },
});

class CharacterListItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.characterObject === nextProps.characterObject) {
      return false;
    }

    return true;
  }

  render() {
    const { characterObject, onOpen, onClose } = this.props;
    const card = characters[characterObject.get('id')];

    const rowStyles = [styles.row];
    const cardAvatarStyles = [styles.cardAvatarWrapper];
    const cardNameStyle = [styles.cardName];
    const cardUniqueStyle = [styles.cardUnique];
    const cardInfoStyle = [styles.cardInfo];
    const cardInfoLogoStyle = [styles.cardInfoLogo];
    const arrowStyle = [styles.arrow];

    if (characterObject.get('isIncompatible') || characterObject.get('isExcluded')) {
      rowStyles.push(styles.incompatibleRow);
      cardAvatarStyles.push(styles.incompatibleCardAvatarWrapper);
      cardNameStyle.push(styles.incompatibleCardName);
      cardUniqueStyle.push(styles.incompatibleCardUnique);
      cardInfoStyle.push(styles.incompatibleCardInfo);
      cardInfoLogoStyle.push(styles.incompatibleCardInfoLogo);
      arrowStyle.push(styles.arrowIncompatible);
    }

    if (characterObject.get('isExcluded')) {
      rowStyles.push(styles.excludedRow);
    }

    const setIcon = validateIcon(swdIcons, card.set) ? (
      <SWDIcon type={ card.set } font={ 'swdestiny' } style={ cardInfoLogoStyle } />
    ) : null;

    const subtitle = card.subtitle ? (
      <Text style={ cardInfoStyle }>{ card.subtitle }</Text>
    ) : null;

    const pointsArray = [card.pointsRegular];
    if (card.pointsElite) {
      pointsArray.push(card.pointsElite);
    }
    const points = pointsArray ? (
      <Text style={ cardInfoStyle }>{ pointsArray.join('/') }</Text>
    ) : null;

    const cardInfo = (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        { setIcon &&
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            { setIcon }
            <Text style={ cardInfoStyle }>&nbsp;</Text>
          </View>
        }
        { subtitle &&
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            { subtitle }
            <Text style={ cardInfoStyle }>&nbsp;&middot;&nbsp;</Text>
          </View>
        }
        { points &&
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            { points }
          </View>
        }
      </View>
    );

    const uniqueIcon = card.isUnique ? (
      <SWDIcon type={ 'UNIQUE' } font={ 'swdestiny' } style={ cardUniqueStyle } />
    ) : null;

    const avatar = (
      <View style={ cardAvatarStyles }>
        <CharacterAvatar
          cardId={ characterObject.get('id') }
          round={ true }
          size={ StyleSheet.flatten(styles.cardAvatarWrapper).width }
        />
      </View>
    );

    const rightButtons = characterObject.get('isExcluded') ? [
      <TouchableHighlight
        activeOpacity={ 0.9 }
        style={[styles.rightSwipeItem, { backgroundColor: 'rgba(230, 126, 34, 1.0)' }]}
        underlayColor='rgba(211, 84, 0, 1.0)'
        onPress={ () => {
          this.swipeable.recenter();
          setTimeout(() => {
            this.props.includeCharacter(characterObject);
          }, 250);
        } }
      >
        <Text style={ styles.rightSwipeItemText }>Include</Text>
      </TouchableHighlight>,
    ] : [
      <TouchableHighlight
        activeOpacity={ 0.9 }
        style={[styles.rightSwipeItem, { backgroundColor: 'rgba(230, 126, 34, 1.0)' }]}
        underlayColor='rgba(211, 84, 0, 1.0)'
        onPress={ () => {
          this.swipeable.recenter();
          setTimeout(() => {
            this.props.excludeCharacter(characterObject);
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
          underlayColor={ 'rgba(236, 240, 241, 1.0)' }
          onPress={ () => this.props.navigate('CharacterDetailScreen', { id: characterObject.get('id') }) }
        >
          <View style={ rowStyles }>
            <View>
              { avatar }
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={ cardNameStyle }>{ card.name }</Text>
                <Text style={ cardNameStyle }>&nbsp;</Text>
                <Text style={ cardNameStyle }>{ uniqueIcon }</Text>
              </View>
              { cardInfo }
            </View>
            <View>
              <Icon name={ 'chevron-right' } size={ 20 } style={ arrowStyle } />
            </View>
          </View>
        </TouchableHighlight>
      </Swipeable>
    );
  }
}

CharacterListItem.propTypes = {
  characterObject: PropTypes.instanceOf(Immutable.Map),
  navigate: PropTypes.func.isRequired,

  includeCharacter: PropTypes.func.isRequired,
  excludeCharacter: PropTypes.func.isRequired,

  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  includeCharacter,
  excludeCharacter,
};

export default connect(null, mapDispatchToProps)(CharacterListItem);
