import React, { Component } from 'react';
import {
  ActionSheetIOS,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';

import SWDIcon from '../../../components/SWDIcon';

import { updateSort } from '../../../actions';

import { cards } from '../../../lib/Destiny';


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

class TeamListView extends Component {

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'Teams',
      headerRight: (
        <Button
          title={ 'Sort' }
          color={ 'rgba(255, 255, 255, 1.0)' }
          onPress={ () => { state.params.showSortActionSheet(); } }
        />
      ),
      headerTintColor: 'rgba(255, 255, 255, 1.0)',
      headerStyle: {
        backgroundColor: 'rgba(155, 89, 182, 1.0)',
      },
    };
  };

  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      showSortActionSheet: this.showSortActionSheet.bind(this),
    });
  }

  renderItem({ item: team }) {
    const { navigate } = this.props.navigation;
    const arrowStyle = [styles.arrow];

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

    return (
      <TouchableOpacity
        activeOpacity={ 0.6 }
        onPress={ () => navigate('TeamDetailScreen', { key: team.get('key') }) }
        style={ styles.row }
        underlayColor={ 'rgba(236, 240, 241, 1.0)' }
      >
        <View style={ styles.teamWrapper }>
          <View style={ styles.teamCharactersWrapper }>
            { characterViews }
          </View>
          <View style={ styles.teamInfoWrapper }>
            <Text style={ styles.teamStat }>{ team.get('dice') } Dice</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('health') } Health</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('points') } Points</Text>
            <Text style={ styles.teamStat }>&middot;</Text>
            <Text style={ styles.teamStat }>{ team.get('affiliation').charAt(0).toUpperCase() + team.get('affiliation').slice(1) }</Text>
          </View>
        </View>
        <View>
          <Icon name={ 'chevron-right' } size={ 20 } style={ arrowStyle } />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { teamsState } = this.props;

    const list = teamsState.get('teams').count() ? (
      <VirtualizedList
        style={ styles.list }
        data={ teamsState.get('teams') }
        renderItem={ this.renderItem }
        getItem={ (data, key) => (data.get ? data.get(key) : data[key]) }
        getItemCount={ data => (data.size || data.count || 0) }
        keyExtractor={ (item, index) => String(index) }
      />
    ) : (
      <View style={{ width: '80%' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgba(149, 165, 166, 1.0)', fontSize: 24, fontWeight: '700', textAlign: 'center' }}>No Teams Found</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'rgba(149, 165, 166, 1.0)', textAlign: 'center' }}>Try changing your characters or adjusting your settings.</Text>
        </View>
      </View>
    );

    return (
      <View style={ styles.container }>
        { list }
      </View>
    );
  }

  showSortActionSheet() {
    const options = [
      'Sort By Dice',
      'Sort By Health',
      'Sort By Points',
      'Cancel',
    ];

    ActionSheetIOS.showActionSheetWithOptions({
      options,
      title: 'Sort Teams',
      message: 'Sort the list of teams by one of the following stats in descending order',
      cancelButtonIndex: 3,
      tintColor: 'rgba(155, 89, 182, 1.0)',
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0: // dice
          this.props.updateSort('dice');
          break;
        case 1: // health
          this.props.updateSort('health');
          break;
        case 2: // points
          this.props.updateSort('points');
          break;
        default:
          break;
      }
    });
  }
}

const mapStateToProps = state => ({
  teamsState: state.teamsReducer,
});

const mapDispatchToProps = { updateSort };

export default connect(mapStateToProps, mapDispatchToProps)(TeamListView);

TeamListView.propTypes = {
  teamsState: React.PropTypes.object.isRequired,
  navigation: React.PropTypes.object.isRequired,
  updateSort: React.PropTypes.func.isRequired,
};
