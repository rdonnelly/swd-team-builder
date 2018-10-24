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
import Icon from 'react-native-vector-icons/Entypo';
import SafariView from 'react-native-safari-view';
import Swiper from 'react-native-swiper';

import CharacterAvatar from '../../components/CharacterAvatar';
import SWDIcon from '../../components/SWDIcon';

import { getAvailableTeams } from '../../store/selectors/teamSelectors';

import { characters, teamsStats } from '../../lib/Destiny';
import { cardBack, cardImages } from '../../lib/DestinyImages';

import { base, colors } from '../../styles';


const styles = StyleSheet.create({
  container: {
    ...base.container,
    backgroundColor: colors.white,
  },
  teamWrapper: {
    alignContent: 'center',
    backgroundColor: colors.lightGray,
    flex: 1,
    width: '100%',
  },
  characterAvatars: {
    alignItems: 'stretch',
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
    color: colors.darkGray,
    fontSize: 18,
    fontWeight: '700',
  },
  diceWrapper: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  characterCount: {
    color: colors.darkGray,
    fontSize: 16,
    fontWeight: '700',
  },
  dice: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 1,
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
  teamStatWrapper: {
    alignItems: 'stretch',
    backgroundColor: colors.lightGray,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  teamStat: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 8,
  },
  plotStatus: {
    backgroundColor: colors.lightGrayTranslucent,
    borderRadius: 4,
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
  },
  plotStatusText: {
    color: colors.darkGray,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  teamSearch: {
    flex: 1,
    paddingHorizontal: 16,
  },
  teamSearchButton: {
    alignItems: 'center',
    backgroundColor: colors.darkGrayDark,
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
  },
  teamSearchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  teamSearchButtonArrow: {
    color: colors.white,
    marginTop: 2,
  },
  swiperWrapper: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 4,
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    paddingVertical: 16,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 300,
    width: '100%',
  },
});


class TeamDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Team Details',
    headerTintColor: colors.headerTint,
    headerStyle: {
      backgroundColor: colors.headerBackground,
    },
  }

  constructor(props) {
    super(props);

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

  shouldComponentUpdate(nextProps) {
    const currentTeamKey = this.props.navigation.state.params.key;
    const nextTeamKey = nextProps.navigation.state.params.key;

    if (currentTeamKey === nextTeamKey) {
      return false;
    }

    return true;
  }

  scrollSwiper = index => () => {
    const scrollBy = index - this.swiper.state.index;
    if (this.swiper && scrollBy) {
      this.swiper.scrollBy(scrollBy);
    }
  }

  searchSWDestinyDB = () => {
    const teamKey = this.props.navigation.state.params.key;
    const { teams } = this.props;
    const team = teams.find(teamObj => teamObj.key === teamKey);

    const urlParams = [];
    team.cK.forEach((characterKey) => {
      const cardId = characterKey.split('_').shift();
      urlParams.push(`cards[]=${cardId}`);
    });

    SafariView.show({
      tintColor: colors.purple,
      url: `http://swdestinydb.com/decklists/find?${urlParams.join('&')}`,
    });
  }

  render() {
    const teamKey = this.props.navigation.state.params.key;
    const { teams } = this.props;
    const team = teams.find(teamObj => teamObj.key === teamKey);
    const maxPlotPoint = teamsStats.maxPoints - team.p;

    const characterAvatars = team.cK.map((characterKey, index) => {
      const [cardId] = characterKey.split('_');
      return (
        <TouchableOpacity
          key={ `avatar__${team.key}__${cardId}` }
          style={ styles.characterAvatarWrapper }
          onPress={ this.scrollSwiper(index) }
        >
          <CharacterAvatar
            cardId={ cardId }
            round={ true }
            size={ 72 }
          />
        </TouchableOpacity>
      );
    });

    const characterNames = team.cK.map((characterKey) => {
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
            key={ `die__${team.key}__${cardId}__${i}` }
            style={ diceStyles }
            type={ 'DIE' }
          />,
        );
      }

      return (
        <View
          key={ `name__${team.key}__${cardId}` }
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

    const imageViews = team.cK.map((characterKey) => {
      const [cardId] = characterKey.split('_');
      return (
        <View
          key={ `image__${team.key}__${cardId}` }
          style={ styles.imageWrapper }
        >
          <Image
            source={ cardImages[cardId] || cardBack }
            style={{ height: 280, resizeMode: 'contain' }}
          />
        </View>
      );
    });

    let teamAffiliationLabel = 'Neutral';
    if (team.a.includes('villain')) {
      teamAffiliationLabel = 'Villain';
    } else if (team.a.includes('hero')) {
      teamAffiliationLabel = 'Hero';
    }

    return (
      <View style={ styles.container }>
        <ScrollView style={ styles.teamWrapper }>
          <View style={ styles.characterAvatars }>
            { characterAvatars }
          </View>
          <View style={ styles.teamCharactersWrapper }>
            { characterNames }
          </View>
          <View style={ styles.teamStatWrapper }>
            <Text style={ styles.teamStat }>{ team.nD } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.h } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.p } Points</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamAffiliationLabel }</Text>
          </View>
          { maxPlotPoint ? (
            <View style={ styles.plotStatus }>
              <Text style={ styles.plotStatusText }>
                Team Supports Plot of Cost { maxPlotPoint } or Less
              </Text>
            </View>) : null
          }
          <View style={ styles.teamSearch }>
            <TouchableOpacity
              onPress={ this.searchSWDestinyDB }
              style={ styles.teamSearchButton }
            >
              <Text style={ styles.teamSearchButtonText }>
                Search for Decks on SWDestinyDB
              </Text>
              <Icon name={ 'chevron-right' } size={ 20 } style={ styles.teamSearchButtonArrow } />
            </TouchableOpacity>
          </View>
          <View style={ styles.swiperWrapper }>
            <Swiper
              activeDotColor={ colors.purple }
              bounces={ true }
              dotColor={ colors.gray }
              height={ 300 }
              loop={ false }
              ref={ (component) => { this.swiper = component; } }
              removeClippedSubviews={ true }
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
  teams: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  teams: getAvailableTeams(state),
});

export default connect(mapStateToProps)(TeamDetailScreen);
