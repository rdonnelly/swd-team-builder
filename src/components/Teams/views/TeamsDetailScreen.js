import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import Swiper from 'react-native-swiper';

import SWDIcon from '../../SWDIcon/SWDIcon';

import { cards } from '../../../lib/Destiny';
import { cardImages } from '../../../lib/DestinyImages';


const styles = StyleSheet.create({
  teamWrapper: {
    alignContent: 'center',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    width: '100%',
  },
  teamCharactersWrapper: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  characterName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 18,
    fontWeight: '700',
  },
  blueCard: {
    color: 'rgba(52, 152, 219,1.0)',
  },
  redCard: {
    color: 'rgba(231, 76, 60,1.0)',
  },
  yellowCard: {
    color: 'rgba(241, 196, 15,1.0)',
  },
  diceWrapper: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  dice: {
    color: 'white',
    fontSize: 14,
    marginTop: 4,
  },
  swiper: {
    flex: 1,
    height: 200,
  },
  imageWrapper: {
    alignItems: 'center',
    flex: 1,
    height: 240,
    paddingVertical: 16,
  },
  teamInfoWrapper: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  teamStat: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 8,
  },
});


class TeamsDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Team Details',
  }

  render() {
    const teamKey = this.props.navigation.state.params.key;
    const { teamsState } = this.props;
    const team = teamsState.get('teams')
      .find(teamObj => teamObj.get('key') === this.props.navigation.state.params.key);

    const characterViews = team.get('characters').map((character) => {
      const card = cards.get(character.get('id'));
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
      if (character.get('isElite') !== null) {
        const numDice = character.get('isElite') ? 2 : 1;
        for (let i = 0; i < numDice; i += 1) {
          diceIcons.push(
            <SWDIcon
              font={ 'swdestiny' }
              key={ `${team.get('key')}___${character.get('id')}___${i}` }
              style={ diceStyles }
              type={ 'DIE' }
            />,
          );
        }
      }

      return (
        <View
          key={ `${team.get('key')}___${character.get('id')}` }
          style={{ flexDirection: 'row' }}
        >
          <Text style={ cardNameStyle }>
            { card.name }
          </Text>
          <View style={ styles.diceWrapper }>
            { diceIcons }
          </View>
          <Text style={ cardNameStyle }>
            { character.get('count') > 1 ? ` x${character.get('count')}` : '' }
          </Text>
        </View>
      );
    });

    const imageViews = team.get('characters').map((character) => {
      return (
        <View key={ character.get('id') } style={ styles.imageWrapper }>
          <Image
            resizeMode='contain'
            source={ cardImages.get(character.get('id')) }
            style={{ flex: 1 }}
          />
        </View>
      );
    }).toJS();

    return (
      <View style={{
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ScrollView style={ styles.teamWrapper }>
          <View style={ styles.teamCharactersWrapper }>
            { characterViews }
          </View>
          <Swiper
            activeDotColor={ 'rgba(155, 89, 182, 1.0)' }
            bounces={ true }
            dotColor={ 'rgba(149, 165, 166, 1.0)' }
            height={ 272 }
            loop={ false } removeClippedSubviews={false}>
            { imageViews }
          </Swiper>
          <View style={ styles.teamInfoWrapper }>
            <Text style={ styles.teamStat }>{ team.get('dice') } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('health') } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('points') } Points</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('affiliation').charAt(0).toUpperCase() + team.get('affiliation').slice(1) }</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

TeamsDetailScreen.propTypes = {
  navigation: React.PropTypes.object.isRequired,

  teamsState: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  teamsState: state.teamsReducer,
});

export default connect(mapStateToProps)(TeamsDetailScreen);
