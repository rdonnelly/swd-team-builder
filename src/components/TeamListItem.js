import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

import CharacterAvatar from './CharacterAvatar';
import SWDIcon from './SWDIcon';

import { characters, teamsStats } from '../lib/Destiny';

import { colors } from '../styles';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrayDark,
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
    marginBottom: 8,
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
    color: colors.darkGray,
    fontSize: 18,
    fontWeight: '400',
  },
  characterCount: {
    color: colors.gray,
    fontSize: 16,
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
  diceWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 4,
  },
  dice: {
    color: colors.gray,
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
    color: colors.gray,
    fontSize: 13,
    fontWeight: '500',
    marginRight: 6,
  },
  teamStatLast: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: '500',
  },
  arrow: {
    color: colors.gray,
    marginTop: 2,
  },
});

class TeamListItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.teamObject === nextProps.teamObject) {
      return false;
    }

    return true;
  }

  render() {
    const {
      teamObject,
      navigate,
    } = this.props;

    const arrowStyle = [styles.arrow];

    const characterViews = teamObject.cK.map((characterKey) => {
      const [cardId, numDice, count] = characterKey.split('_');
      const card = characters[cardId];

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
            key={ `${teamObject.key}___${cardId}___${i}` }
            style={ diceStyles }
            type={ 'DIE' }
          />,
        );
      }

      return (
        <View
          key={ `${teamObject.key}___${cardId}` }
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

    const plotPoints = teamsStats.maxPoints - teamObject.p;

    return (
      <TouchableOpacity
        activeOpacity={ 0.6 }
        onPress={ () => navigate('TeamDetailScreen', { key: teamObject.key }) }
        style={ styles.container }
        underlayColor={ colors.lightGray }
      >
        <View style={ styles.teamWrapper }>
          <View style={ styles.teamCharactersWrapper }>
            { characterViews }
          </View>
          <View style={ styles.teamInfoWrapper }>
            <Text style={ styles.teamStat }>{ teamObject.nD } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamObject.h } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamObject.p } Points</Text>
            { plotPoints ? (<Text style={ styles.teamStat }>&middot;</Text>) : null }
            { plotPoints ? (<Text style={ styles.teamStatLast }>{ `${plotPoints} Plot Point${plotPoints > 1 ? 's' : ''}` }</Text>) : null }
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
