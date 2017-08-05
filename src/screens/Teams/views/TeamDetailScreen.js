import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import SafariView from 'react-native-safari-view';

import Swiper from 'react-native-swiper';

import CharacterAvatar from '../../../components/CharacterAvatar';
import SWDIcon from '../../../components/SWDIcon';

import { characterCards } from '../../../lib/Destiny';
import { cardImages } from '../../../lib/DestinyImages';


const styles = StyleSheet.create({
  teamWrapper: {
    alignContent: 'center',
    flex: 1,
    width: '100%',
  },
  characterAvatars: {
    alignItems: 'stretch',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
  },
  teamCharactersWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  characterName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 18,
    fontWeight: '700',
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
    fontSize: 14,
    marginTop: 4,
  },
  teamStatWrapper: {
    alignItems: 'stretch',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  teamStat: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 8,
  },
  teamSearch: {
    alignItems: 'stretch',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  teamSearchButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(44, 62, 80, 1.0)',
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    padding: 8,
  },
  teamSearchButtonText: {
    color: 'rgba(255, 255, 255, 1.0)',
  },
  swiperWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  imageWrapper: {
    alignItems: 'center',
    flex: 1,
    height: 300,
    width: '100%',
  },
});


class TeamDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Team Details',
    headerTintColor: 'rgba(255, 255, 255, 1.0)',
    headerStyle: {
      backgroundColor: 'rgba(155, 89, 182, 1.0)',
    },
  }

  constructor(props) {
    super(props);

    this.searchSWDestinyDB = this.searchSWDestinyDB.bind(this);

    SafariView.addEventListener(
      'onShow',
      () => {
        StatusBar.setBarStyle('dark-content');
      },
    );

    SafariView.addEventListener(
      'onDismiss',
      () => {
        StatusBar.setBarStyle('light-content');
      },
    );
  }

  searchSWDestinyDB() {
    const teamKey = this.props.navigation.state.params.key;
    const { teamsState } = this.props;
    const team = teamsState.get('teams')
      .find(teamObj => teamObj.get('key') === teamKey);

    const urlParams = [];
    team.get('characters').forEach((character) => {
      urlParams.push(`cards[]=${character.get('id')}`);
    });

    SafariView.show({
      tintColor: 'rgba(155, 89, 182, 1.0)',
      url: `http://swdestinydb.com/decklists/find?${urlParams.join('&')}`,
    });
  }

  shouldComponentUpdate(nextProps) {
    const currentTeamKey = this.props.navigation.state.params.key;
    const nextTeamKey = nextProps.navigation.state.params.key;

    if (currentTeamKey === nextTeamKey) {
      return false;
    }

    return true;
  }

  render() {
    const teamKey = this.props.navigation.state.params.key;
    const { teamsState } = this.props;
    const team = teamsState.get('teams')
      .find(teamObj => teamObj.get('key') === teamKey);

    const characterAvatars = team.get('characters').map(character =>
      <CharacterAvatar
        key={ `avatar___${team.get('key')}___${character.get('id')}` }
        cardId={ character.get('id') }
        isElite={ character.get('isElite') }
        count={ character.get('count') }
      >
      </CharacterAvatar>,
    );

    const characterViews = team.get('characters').map((character) => {
      const card = characterCards.get(character.get('id'));
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
              key={ `die___${team.get('key')}___${character.get('id')}___${i}` }
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

    const imageViews = team.get('characters').map(character =>
      <View key={ character.get('id') } style={ styles.imageWrapper }>
        <Image
          source={ cardImages.get(character.get('id')) }
          style={{ height: 280, resizeMode: 'contain' }}
        />
      </View>,
    ).toJS();

    return (
      <View style={{
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ScrollView style={ styles.teamWrapper }>
          <View style={ styles.characterAvatars }>
            { characterAvatars }
          </View>
          <View style={ styles.teamCharactersWrapper }>
            { characterViews }
          </View>
          <View style={ styles.teamStatWrapper }>
            <Text style={ styles.teamStat }>{ team.get('dice') } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('health') } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('points') } Points</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('affiliation').charAt(0).toUpperCase() + team.get('affiliation').slice(1) }</Text>
          </View>
          <View style={ styles.teamSearch }>
            <TouchableOpacity
              onPress={ this.searchSWDestinyDB }
              style={ styles.teamSearchButton }
            >
              <Text style={ styles.teamSearchButtonText }>
                Search for Decks on SWDestinyDB
              </Text>
            </TouchableOpacity>
          </View>
          <View style={ styles.swiperWrapper }>
            <Swiper
              activeDotColor={ 'rgba(155, 89, 182, 1.0)' }
              bounces={ true }
              dotColor={ 'rgba(149, 165, 166, 1.0)' }
              height={ 300 }
              loop={ false }
              removeClippedSubviews={ false }
            >
              { imageViews }
            </Swiper>
          </View>
        </ScrollView>
      </View>
    );
  }
}

TeamDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  teamsState: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  teamsState: state.teamsReducer,
});

export default connect(mapStateToProps)(TeamDetailScreen);
