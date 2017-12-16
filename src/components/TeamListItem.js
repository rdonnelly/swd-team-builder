import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import CharacterAvatar from '../components/CharacterAvatar';
import SWDIcon from '../components/SWDIcon';

import { characterCards } from '../lib/Destiny';

export const ITEM_HEIGHT = 113;


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
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
  teamWrapper: {
    flex: 1,
  },
  teamCharactersWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  characterWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2,
  },
  avatarWrapper: {
    marginRight: 4,
  },
  characterName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 18,
    fontWeight: '400',
  },
  characterCount: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 16,
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
  diceWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 4,
  },
  dice: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 12,
    marginTop: 1,
  },
  teamInfoWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  teamStat: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 13,
    fontWeight: '500',
    paddingRight: 8,
  },
  arrow: {
    color: 'rgba(149, 165, 166, 1.0)',
    marginTop: 2,
  },
});

class TeamListItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (!this.props.teamObject.equals(nextProps.teamObject)) {
      return true;
    }

    return false;
  }

  render() {
    const {
      teamObject,
      navigate,
    } = this.props;

    const arrowStyle = [styles.arrow];

    const characterViews = teamObject.get('cK').map((characterKey) => {
      const [cardId, numDice, count] = characterKey.split('_');
      const card = characterCards.find(characterCard => characterCard.id === cardId);

      const characterNameStyles = [styles.characterName];
      const diceStyles = [styles.dice];
      const characterCountStyles = [styles.characterCount];

      if (card.faction === 'blue') {
        diceStyles.push(styles.blueCard);
        characterCountStyles.push(styles.blueCard);
      }
      if (card.faction === 'red') {
        diceStyles.push(styles.redCard);
        characterCountStyles.push(styles.redCard);
      }
      if (card.faction === 'yellow') {
        diceStyles.push(styles.yellowCard);
        characterCountStyles.push(styles.yellowCard);
      }

      const avatar = (
        <View style={ styles.avatarWrapper }>
          <CharacterAvatar
            cardId={ card.id }
            round={ true }
            size={ 22 }
          />
        </View>
      );

      const diceIcons = [];
      for (let i = 0; i < numDice; i += 1) {
        diceIcons.push(
          <SWDIcon
            font={ 'swdestiny' }
            key={ `${teamObject.get('key')}___${cardId}___${i}` }
            style={ diceStyles }
            type={ 'DIE' }
          />,
        );
      }

      return (
        <View
          key={ `${teamObject.get('key')}___${cardId}` }
          style={ styles.characterWrapper }
        >
          { avatar }
          <Text style={ characterNameStyles }>
            { card.name }
          </Text>
          <View style={ styles.diceWrapper }>
            { diceIcons }
          </View>
          <Text style={ characterCountStyles }>
            { count > 1 ? ` x${count}` : '' }
          </Text>
        </View>
      );
    });

    return (
      <TouchableOpacity
        activeOpacity={ 0.6 }
        onPress={ () => navigate('TeamDetailScreen', { key: teamObject.get('key') }) }
        style={ styles.row }
        underlayColor={ 'rgba(236, 240, 241, 1.0)' }
      >
        <View style={ styles.teamWrapper }>
          <View style={ styles.teamCharactersWrapper }>
            { characterViews }
          </View>
          <View style={ styles.teamInfoWrapper }>
            <Text style={ styles.teamStat }>{ teamObject.get('nD') } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamObject.get('h') } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamObject.get('p') } Points</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamObject.get('a').charAt(0).toUpperCase() + teamObject.get('a').slice(1) }</Text>
          </View>
        </View>
        <View>
          <Icon name={ 'chevron-right' } size={ 20 } style={ arrowStyle } />
        </View>
      </TouchableOpacity>
    );
  }
}

export default TeamListItem;

TeamListItem.propTypes = {
  teamObject: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};
