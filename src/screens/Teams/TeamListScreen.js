import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ActionSheetIOS,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import TeamListItem from '../../components/TeamListItem';

import { updateSort } from '../../actions';
import { getAvailableTeams } from '../../selectors/teamSelectors';

import { colors } from '../../styles';


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  row: {
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
  },
  characterName: {
    color: colors.darkGray,
    fontSize: 18,
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
    color: colors.gray,
    fontSize: 13,
    fontWeight: '500',
    paddingRight: 8,
  },
  arrow: {
    color: colors.gray,
    marginTop: 2,
  },
});

class TeamListScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'Teams',
      headerRight: (
        <Button
          title={ 'Sort' }
          color={ colors.white }
          onPress={ () => { state.params.showSortActionSheet(); } }
        />
      ),
      headerTintColor: colors.headerTint,
      headerStyle: {
        backgroundColor: colors.headerBackground,
      },
    };
  };

  constructor(props) {
    super(props);

    this.scrollListToTop = this.scrollListToTop.bind(this);
    this.showSortActionSheet = this.showSortActionSheet.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this.scrollListToTop,
      showSortActionSheet: this.showSortActionSheet,
    });
  }

  scrollListToTop() {
    this.listView.scrollToOffset(0);
  }

  renderItem({ item: teamObject }) {
    const { navigate } = this.props.navigation;

    return (
      <TeamListItem
        teamObject={ teamObject }
        navigate={ navigate }
      />
    );
  }

  render() {
    const list = this.props.teams.length ? (
      <FlatList
        ref={ (component) => { this.listView = component; } }
        style={ styles.list }
        data={ this.props.teams }
        extraData={ this.state }
        renderItem={ this.renderItem }
        keyExtractor={ item => item.key }
        showsVerticalScrollIndicator={ false }
        initialNumToRender={ 9 }
        maxToRenderPerBatch={ 9 }
        updateCellsBatchingPeriod={ 100 }
        windowSize={ 35 }
      />
    ) : (
      <View style={{ width: '80%' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.gray, fontSize: 24, fontWeight: '700', textAlign: 'center' }}>No Teams Compatible</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.gray, textAlign: 'center' }}>
            Try changing your selected characters or adjusting your settings.
          </Text>
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
      tintColor: colors.brand,
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
  teams: getAvailableTeams(state),
});

const mapDispatchToProps = { updateSort };

export default connect(mapStateToProps, mapDispatchToProps)(TeamListScreen);

TeamListScreen.propTypes = {
  teams: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  updateSort: PropTypes.func.isRequired,
};
