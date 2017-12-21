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

import { getAvailableTeams } from '../../../selectors/teamSelectors';

import { characters } from '../../../lib/Destiny';
import { cardBack, cardImages } from '../../../lib/DestinyImages';


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
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  characterAvatarWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  teamCharactersWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(236, 240, 241, 1.0)',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  characterWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  characterName: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 18,
    fontWeight: '700',
  },
  diceWrapper: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  characterCount: {
    color: 'rgba(52, 73, 94, 1.0)',
    fontSize: 16,
    fontWeight: '700',
  },
  dice: {
    color: 'rgba(149, 165, 166, 1.0)',
    fontSize: 12,
    marginTop: 1,
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
    const { teams } = this.props;
    const team = teams.find(teamObj => teamObj.get('key') === teamKey);

    const urlParams = [];
    team.get('cK').forEach((characterKey) => {
      const cardId = characterKey.split('_').shift();
      urlParams.push(`cards[]=${cardId}`);
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
    const { teams } = this.props;
    const team = teams.find(teamObj => teamObj.get('key') === teamKey);

    const characterAvatars = team.get('cK').map((characterKey) => {
      const [cardId] = characterKey.split('_');
      return (
        <View
          key={ `avatar__${team.get('key')}__${cardId}` }
          style={ styles.characterAvatarWrapper }
        >
          <CharacterAvatar
            cardId={ cardId }
            round={ true }
            size={ 72 }
          />
        </View>
      );
    });

    const characterNames = team.get('cK').map((characterKey) => {
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

      const diceIcons = [];
      for (let i = 0; i < numDice; i += 1) {
        diceIcons.push(
          <SWDIcon
            font={ 'swdestiny' }
            key={ `die__${team.get('key')}__${cardId}__${i}` }
            style={ diceStyles }
            type={ 'DIE' }
          />,
        );
      }

      return (
        <View
          key={ `name__${team.get('key')}__${cardId}` }
          style={ styles.characterWrapper }
        >
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

    const imageViews = team.get('cK').map((characterKey) => {
      const [cardId] = characterKey.split('_');
      return (
        <View
          key={ `image__${team.get('key')}__${cardId}` }
          style={ styles.imageWrapper }
        >
          <Image
            source={ cardImages[cardId] || cardBack }
            style={{ height: 280, resizeMode: 'contain' }}
          />
        </View>
      );
    }).toJS();

    let teamAffiliationLabel = 'Neutral';
    if (team.get('a').includes('villain')) {
      teamAffiliationLabel = 'Villain';
    } else if (team.get('a').includes('hero')) {
      teamAffiliationLabel = 'Hero';
    }

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
            { characterNames }
          </View>
          <View style={ styles.teamStatWrapper }>
            <Text style={ styles.teamStat }>{ team.get('d') } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('h') } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('p') } Points</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamAffiliationLabel }</Text>
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
  teams: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  teams: getAvailableTeams(state),
});

export default connect(mapStateToProps)(TeamDetailScreen);
