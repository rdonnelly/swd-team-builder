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
import Icon from 'react-native-vector-icons/Entypo';
import SafariView from 'react-native-safari-view';
import Swiper from 'react-native-swiper';

import CharacterAvatar from '../../components/CharacterAvatar';
import SWDIcon from '../../components/SWDIcon';

import withData from '../../components/withData';

import { characters, plots } from '../../lib/Destiny';
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  plotStatusText: {
    color: colors.darkGray,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  plotStatusTextCard: {
    fontStyle: 'italic',
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
  image: {
    height: 280,
    resizeMode: 'contain',
  },
});


class TeamDetailScreen extends React.Component {
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
    const currentTeamKey = this.props.navigation.getParam('key');
    const nextTeamKey = nextProps.navigation.getParam('key');

    if (currentTeamKey !== nextTeamKey) {
      return true;
    }

    if (this.props.data !== nextProps.data) {
      return true;
    }

    return false;
  }

  scrollSwiper = (index) => () => {
    const scrollBy = index - this.swiper.state.index;
    if (this.swiper && scrollBy) {
      this.swiper.scrollBy(scrollBy);
    }
  }

  searchSWDestinyDB = () => {
    const teamKey = this.props.navigation.getParam('key');
    const [charactersKey, plotId] = teamKey.split('____').pop().split('___');

    const urlParams = [];

    charactersKey.split('__').forEach((characterKey) => {
      const cardId = characterKey.split('_').shift();
      urlParams.push(`cards[]=${cardId}`);
    });

    if (plotId) {
      urlParams.push(`cards[]=${plotId}`);
    }

    SafariView.show({
      tintColor: colors.purple,
      url: `http://swdestinydb.com/decklists/find?${urlParams.join('&')}`,
    });
  }

  render() {
    const teamKey = this.props.navigation.getParam('key');
    const [charactersKey, plotId] = teamKey.split('____').pop().split('___');
    const { data: team } = this.props;

    if (!team) {
      return null;
    }

    // const maxPlotPoint = teamsStats.maxPoints - team.points;
    let plotStatusText = null;
    if (plotId) {
      const plot = plots[plotId];
      plotStatusText = (
        <Text>
          Team Requires Plot: <Text style={ styles.plotStatusTextCard }>{ plot.name }</Text>
        </Text>
      );
    } else if (team.points > 30) {
      plotStatusText = `Team Requires Plot of ${30 - team.points} Points or Less`;
    } else if (team.points < 30) {
      plotStatusText = `Team Supports Plot of ${30 - team.points} Points or Less`;
    }

    const characterAvatars = charactersKey.split('__').map((characterKey, index) => {
      const [cardId] = characterKey.split('_');
      return (
        <TouchableOpacity
          key={ `avatar__${teamKey}__${cardId}` }
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

    const characterNames = charactersKey.split('__').map((characterKey) => {
      const [cardId, diceCount, count] = characterKey.split('_');
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
      for (let i = 0; i < diceCount; i += 1) {
        diceIcons.push(
          <SWDIcon
            key={ `die__${teamKey}__${cardId}__${i}` }
            style={ diceStyles }
            type={ 'DIE' }
          />,
        );
      }

      return (
        <View
          key={ `name__${teamKey}__${cardId}` }
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

    const imageViews = charactersKey.split('__').map((characterKey) => {
      const [cardId] = characterKey.split('_');
      return (
        <View
          key={ `image__${teamKey}__${cardId}` }
          style={ styles.imageWrapper }
        >
          <Image
            source={ cardImages[cardId] || cardBack }
            style={ styles.image }
          />
        </View>
      );
    });

    let teamAffiliationLabel = 'Neutral';
    if (team.affiliationHero) {
      teamAffiliationLabel = 'Hero';
    } else if (team.affiliationVillain) {
      teamAffiliationLabel = 'Villain';
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
            <Text style={ styles.teamStat }>{ team.diceCount } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.health } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.points } Points</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ teamAffiliationLabel }</Text>
          </View>
          { plotStatusText ? (
            <View style={ styles.plotStatus }>
              <Text style={ styles.plotStatusText }>
                { plotStatusText }
              </Text>
            </View>
          ) : null }
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

  data: PropTypes.object,
};

export default withData()(
  TeamDetailScreen,
  (dataSource, props) => dataSource.getTeam(props.navigation.getParam('key')),
);
