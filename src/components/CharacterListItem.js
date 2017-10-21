import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import CharacterAvatar from '../components/CharacterAvatar';
import SWDIcon from '../components/SWDIcon';

import { characterCards } from '../lib/Destiny';


const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(189, 195, 199, 1.0)',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  incompatibleRow: {
    paddingVertical: 6,
  },
  cardAvatarWrapper: {
    marginRight: 10,
  },
  incompatibleCardAvatarWrapper: {
    opacity: 0.4,
  },
  incompatibleCardLogo: {
    color: 'rgba(189, 195, 199, 1.0)',
    fontSize: 20,
    paddingHorizontal: 2,
  },
  cardName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 20,
  },
  incompatibleCardName: {
    color: 'rgba(189, 195, 199, 1.0)',
    fontSize: 16,
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
    fontSize: 12,
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
});

class CharacterListItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (!this.props.characterObject.equals(nextProps.characterObject)) {
      return true;
    }

    return false;
  }

  render() {
    const { characterObject } = this.props;
    const card = characterCards.find(characterCard => characterCard.id === characterObject.get('id'));

    const rowStyle = [styles.row];
    const cardAvatarStyles = [styles.cardAvatarWrapper];
    const cardNameStyle = [styles.cardName];
    const cardUniqueStyle = [styles.cardUnique];
    const cardInfoStyle = [styles.cardInfo];
    const cardInfoLogoStyle = [styles.cardInfoLogo];
    const arrowStyle = [styles.arrow];
    let avatarSize = 42;

    if (!characterObject.get('isCompatibile')) {
      rowStyle.push(styles.incompatibleRow);
      cardAvatarStyles.push(styles.incompatibleCardAvatarWrapper);
      avatarSize = 24;
      cardNameStyle.push(styles.incompatibleCardName);
      cardUniqueStyle.push(styles.incompatibleCardUnique);
      cardInfoStyle.push(styles.incompatibleCardInfo);
      cardInfoLogoStyle.push(styles.incompatibleCardInfoLogo);
      arrowStyle.push(styles.arrowIncompatible);
    }

    const setIcon = (
      <SWDIcon type={ card.set } font={ 'swdestiny' } style={ cardInfoLogoStyle } />
    );

    const subtitle = card.subtitle ? (
      <Text style={ cardInfoStyle }>{ card.subtitle }</Text>
    ) : null;

    const points = card.points ? (
      <Text style={ cardInfoStyle }>{ card.points.join('/') }</Text>
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
          size={ avatarSize }
        />
      </View>
    );

    return (
      <TouchableHighlight
        activeOpacity={ 0.4 }
        underlayColor={ 'rgba(236, 240, 241, 1.0)' }
        onPress={ () => this.props.navigate('CharacterDetailScreen', { id: characterObject.get('id') }) }
      >
        <View style={ rowStyle }>
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
    );
  }
}

export default CharacterListItem;

CharacterListItem.propTypes = {
  characterObject: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};
