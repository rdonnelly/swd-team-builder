import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import CharacterListItem, { ITEM_HEIGHT as characterListItemHeight } from '../../components/CharacterListItem';
import SelectedCharacters, { CONTAINER_PADDING as selectedCharactersContainerPadding, ITEM_HEIGHT as selectedCharactersItemHeight } from '../../components/SelectedCharacters';

import { getCharactersSorted } from '../../store/selectors/characterSelectors';
import { getDeckCharactersCount } from '../../store/selectors/deckSelectors';

import { colors } from '../../styles';


const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: colors.lightGray,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  selectedCharactersContainer: {
    bottom: 6,
    left: 6,
    position: 'absolute',
    right: 6,
  },
});


class CharacterListScreen extends PureComponent {
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

    this.closeOpenSwipeable = this.closeOpenSwipeable.bind(this);
    this.onSwipeableOpen = this.onSwipeableOpen.bind(this);
    this.onSwipeableClose = this.onSwipeableClose.bind(this);
    this.navigateToCharacterDetails = this.navigateToCharacterDetails.bind(this);
    this.scrollListToTop = this.scrollListToTop.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this.scrollListToTop,
    });
  }

  closeOpenSwipeable() {
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

  scrollListToTop() {
    if (this.listView) {
      this.listView.scrollToOffset(0);
    }
  }

  renderItem({ item: characterObject }) {
    return (
      <CharacterListItem
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
      offset: characterListItemHeight * index,
      length: characterListItemHeight,
      index,
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    const selectedCharactersHeight = selectedCharactersContainerPadding +
      (Math.max(1, this.props.deckCharacterCount) * selectedCharactersItemHeight);

    return (
      <View style={ styles.container }>
        <FlatList
          ref={ (component) => { this.listView = component; } }
          style={ styles.list }
          data={ this.props.characters }
          extraData={ this.state }
          renderItem={ this.renderItem }
          keyExtractor={ item => item.id }
          getItemLayout={ this.getItemLayout }
          onScrollEndDrag={ this.closeOpenSwipeable }
          contentContainerStyle={{ paddingBottom: selectedCharactersHeight + 12 }}
          initialNumToRender={ 9 }
          maxToRenderPerBatch={ 9 }
          updateCellsBatchingPeriod={ 100 }
          windowSize={ 35 }
        />
        <View style={ styles.selectedCharactersContainer }>
          <SelectedCharacters navigate={ navigate }></SelectedCharacters>
        </View>
      </View>
    );
  }
}

CharacterListScreen.propTypes = {
  characters: PropTypes.array.isRequired,
  deckCharacterCount: PropTypes.number.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  characters: getCharactersSorted(state),
  deckCharacterCount: getDeckCharactersCount(state),
});

export default connect(mapStateToProps)(CharacterListScreen);
