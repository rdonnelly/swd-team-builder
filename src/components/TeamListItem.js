import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import SWDIcon from '../components/SWDIcon';

import { characterCards } from '../lib/Destiny';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
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
  characterName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 18,
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
    flexDirection: 'row',
    marginLeft: 4,
  },
  dice: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
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

    const characterViews = teamObject.get('characters').map((characterObject) => {
      const card = characterCards.find(characterCard => characterCard.id === characterObject.get('id'));
      const cardNameStyle = [styles.characterName];
      const diceStyles = [styles.dice];

      if (card.faction === 'blue') {
        cardNameStyle.push(styles.blueCard);
        diceStyles.push(styles.blueCard);
      }
      if (card.faction === 'red') {
        cardNameStyle.push(styles.redCard);
        diceStyles.push(styles.redCard);
      }
      if (card.faction === 'yellow') {
        cardNameStyle.push(styles.yellowCard);
        diceStyles.push(styles.yellowCard);
      }

      const diceIcons = [];
      if (characterObject.get('isElite') !== null) {
        const numDice = characterObject.get('isElite') ? 2 : 1;
        for (let i = 0; i < numDice; i += 1) {
          diceIcons.push(
            <SWDIcon
              font={ 'swdestiny' }
              key={ `${teamObject.get('key')}___${characterObject.get('id')}___${i}` }
              style={ diceStyles }
              type={ 'DIE' }
            />,
          );
        }
      }

      return (
        <View
          key={ `${teamObject.get('key')}___${characterObject.get('id')}` }
          style={{ flexDirection: 'row' }}
        >
          <Text style={ cardNameStyle }>
            { card.name }
          </Text>
          <View style={ styles.diceWrapper }>
            { diceIcons }
          </View>
          <Text style={ cardNameStyle }>
            { characterObject.get('count') > 1 ? ` x${characterObject.get('count')}` : '' }
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
            <Text style={ styles.teamStat }>{ teamObject.get('dice') } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamObject.get('health') } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamObject.get('points') } Points</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamObject.get('affiliation').charAt(0).toUpperCase() + teamObject.get('affiliation').slice(1) }</Text>
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
