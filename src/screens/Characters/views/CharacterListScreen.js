import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import CharacterListItem, { ITEM_HEIGHT } from '../../../components/CharacterListItem';
import SelectedCharacters from '../../../components/SelectedCharacters';

import { getCharactersSorted } from '../../../selectors/characterSelectors';

import { colors } from '../../../styles';


const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: colors.lightGray,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
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
  incompatibleRow: {
    borderColor: colors.lightGrayDark,
    paddingVertical: 6,
  },
  cardLogo: {
    color: colors.lightGrayDark,
    fontSize: 24,
    textAlign: 'center',
    width: 36,
  },
  incompatibleCardLogo: {
    color: colors.lightGrayDark,
    fontSize: 20,
    paddingHorizontal: 2,
  },
  cardName: {
    color: colors.darkGray,
    fontSize: 20,
  },
  incompatibleCardName: {
    color: colors.lightGrayDark,
    fontSize: 16,
  },
  cardUnique: {
    color: colors.gray,
    fontSize: 16,
  },
  incompatibleCardUnique: {
    color: colors.lightGrayDark,
  },
  cardInfo: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: '500',
  },
  incompatibleCardInfo: {
    color: colors.lightGrayDark,
    fontSize: 12,
  },
  cardInfoLogo: {
    color: colors.gray,
    fontSize: 10,
  },
  incompatibleCardInfoLogo: {
    color: colors.lightGrayDark,
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
  arrow: {
    color: colors.gray,
    marginTop: 2,
  },
  arrowIncompatible: {
    color: colors.lightGrayDark,
  },
});


class CharacterListScreen extends Component {
  static navigationOptions = {
    title: 'Characters',
    headerTintColor: colors.headerTint,
    headerStyle: {
      backgroundColor: colors.headerBackground,
    },
  };

  state = {
    currentlyOpenSwipeable: null,
  };

  constructor(props) {
    super(props);

    this.handleScrollBeginDrag = this.handleScrollBeginDrag.bind(this);
    this.onSwipeableOpen = this.onSwipeableOpen.bind(this);
    this.onSwipeableClose = this.onSwipeableClose.bind(this);
    this.navigateToCharacterDetails = this.navigateToCharacterDetails.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.characters === nextProps.characters) {
      return false;
    }

    return true;
  }

  handleScrollBeginDrag() {
    const { currentlyOpenSwipeable } = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  }

  onSwipeableOpen(event, gestureState, swipeable) {
    const { currentlyOpenSwipeable } = this.state;
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
      currentlyOpenSwipeable.recenter();
    }

    this.setState({ currentlyOpenSwipeable: swipeable });
  }

  onSwipeableClose() {
    this.setState({ currentlyOpenSwipeable: null });
  }

  navigateToCharacterDetails(characterId) {
    this.props.navigation.navigate('CharacterDetailScreen', { id: characterId });
  }

  renderItem({ item: characterObject }) {
    return (
      <CharacterListItem
        // characterObject={ characterObject }
        characterId={ characterObject.id }
        characterIsExcluded={ characterObject.isExcluded }
        characterIsIncompatible={ characterObject.isIncompatible }
        navigate={ this.navigateToCharacterDetails }
        onOpen={ this.onSwipeableOpen }
        onClose={ this.onSwipeableClose }
      />
    );
  }

  getItemLayout(data, index) {
    return {
      offset: ITEM_HEIGHT * index,
      length: ITEM_HEIGHT,
      index,
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={ styles.container }>
        <FlatList
          style={ styles.list }
          data={ this.props.characters }
          extraData={ this.state }
          renderItem={ this.renderItem }
          keyExtractor={ item => item.id }
          getItemLayout={ this.getItemLayout }
          onScrollBeginDrag={ this.handleScrollBeginDrag }
        />
        <SelectedCharacters navigate={ navigate }></SelectedCharacters>
      </View>
    );
  }
}

CharacterListScreen.propTypes = {
  characters: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  characters: getCharactersSorted(state),
});

export default connect(mapStateToProps)(CharacterListScreen);
