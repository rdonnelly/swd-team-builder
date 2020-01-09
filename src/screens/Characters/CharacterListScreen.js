import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';

import CharacterListItem, {
  ITEM_HEIGHT as characterListItemHeight,
} from '../../components/CharacterListItem';
import SelectedCharacters from '../../components/SelectedCharacters';

import { updateCharacterQuery } from '../../store/actions';
import {
  getQuery,
  getCharactersSortedAndQueried,
  getCharacterCountTotal,
  getCharacterCountCompatible,
  getCharacterCountQueried,
} from '../../store/selectors/characterSelectors';

import { base, colors } from '../../styles';

const screen = Dimensions.get('screen');

const styles = StyleSheet.create({
  headerIconContainer: {
    ...base.headerIconContainer,
  },
  headerIcon: {
    ...base.headerIcon,
  },
  container: {
    ...base.container,
    backgroundColor: colors.lightGray,
  },
  filterCount: {
    alignItems: 'center',
    backgroundColor: colors.whiteTranslucent95,
    paddingVertical: 2,
    width: '100%',

    top: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1000,
  },
  filterCountText: {
    color: colors.turquoiseDark,
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    backgroundColor: colors.lightGrayTranslucent,
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
  listContent: {
    paddingBottom: 72,
  },
  listFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  listFooterText: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  floatingControls: {
    ...base.floatingControls,
    paddingHorizontal: 0,
  },
  floatingControlsDivider: {
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    marginHorizontal: 12,
    marginVertical: 8,
    width: 4,
  },
  selectedCharactersContainer: {
    paddingLeft: 12,
    width: screen.width - 24,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingRight: 12,
    width: screen.width,
  },
  searchInput: {
    ...base.input,
    flex: 1,
  },
});

class CharacterListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerTitle: 'Characters',
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            state.params.showSearchInput();
          }}
          style={styles.headerIconContainer}
        >
          <FontAwesome5Icon
            name={'search'}
            size={18}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      ),
    };
  };

  state = {
    currentlyOpenSwipeable: null,
    searchInputEditable: true,
  };

  constructor(props) {
    super(props);

    if (props.navigation) {
      props.navigation.setParams({
        showSearchInput: this.showSearchInput,
        resetScreen: this.resetScreen,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.characters !== nextProps.characters) {
      return true;
    }

    if (
      this.state.currentlyOpenSwipeable !== nextState.currentlyOpenSwipeable ||
      this.state.searchInputEditable !== nextState.searchInputEditable
    ) {
      return true;
    }

    return false;
  }

  static getItemLayout(data, index) {
    return {
      offset: characterListItemHeight * index,
      length: characterListItemHeight,
      index,
    };
  }

  showSearchInput = () => {
    this.floatingActionScrollView.scrollToEnd({ animated: true });
  };

  handleFloatingControlsScrollBeginDrag = () => {
    this.searchInput.blur();
    this.setState({
      searchInputEditable: false,
    });
  };

  handleFloatingControlsScrollEndDrag = () => {
    this.searchInput.blur();
    this.setState({
      searchInputEditable: true,
    });
  };

  // handleFloatingControlsMomentumScrollEnd = ({ nativeEvent }) => {
  //   const rightSideScrollPosition =
  //     nativeEvent.layoutMeasurement.width + nativeEvent.contentOffset.x;
  //   const isScrolledToEnd = rightSideScrollPosition >= nativeEvent.contentSize.width;
  //   if (isScrolledToEnd) {
  //     this.searchInput.focus();
  //   }
  // }

  handleSearchInputSubmitEditing = ({ nativeEvent }) => {
    const query = nativeEvent.text;
    if (query) {
      this.props.updateCharacterQuery(query);
    }
  };

  handleSearchInputChange = ({ nativeEvent }) => {
    const query = nativeEvent.text;
    if (!query) {
      this.props.updateCharacterQuery('');
    }
  };

  closeOpenSwipeable = () => {
    const { currentlyOpenSwipeable } = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  handleSwipeableOpen = (event, gestureState, swipeable) => {
    const { currentlyOpenSwipeable } = this.state;
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
      currentlyOpenSwipeable.recenter();
    }

    this.setState({ currentlyOpenSwipeable: swipeable });
  };

  handleSwipeableClose = () => {
    this.setState({ currentlyOpenSwipeable: null });
  };

  resetScreen = () => {
    if (this.listView) {
      this.listView.scrollToOffset(0);
      this.floatingActionScrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  renderItem = ({ item: characterObject }) => (
    <CharacterListItem
      characterId={characterObject.id}
      characterIsExcluded={characterObject.isExcluded}
      characterIsIncompatible={characterObject.isIncompatible}
      onOpen={this.handleSwipeableOpen}
      onClose={this.handleSwipeableClose}
    />
  );

  renderFooter = () => {
    const {
      characterQuery,
      characterCountTotal,
      characterCountCompatible,
      characterCountQueried,
    } = this.props;

    const hiddenByCompatibilityCount =
      characterCountTotal - characterCountCompatible;

    if (characterCountQueried > 0 && hiddenByCompatibilityCount > 0) {
      return (
        <View style={styles.listFooter}>
          <Text style={styles.listFooterText}>
            Hiding {hiddenByCompatibilityCount} Incompatible Characters
          </Text>
        </View>
      );
    }

    if (characterCountQueried === 0) {
      let message = '';
      switch (true) {
        case !characterQuery:
          message = 'Hmm...try removing characters from your team.';
          break;
        case hiddenByCompatibilityCount === 0:
          message = 'Hmm...try a different search term.';
          break;
        default:
          message =
            'Hmm...try a different search term or removing characters from your team.';
      }

      return (
        <View style={styles.listFooter}>
          <Text style={styles.listFooterText}>{message}</Text>
        </View>
      );
    }

    return null;
  };

  render() {
    const {
      characterQuery,
      characterCountTotal,
      characterCountQueried,
    } = this.props;
    const characterCountQueriedDiff =
      characterCountTotal - characterCountQueried;

    const listContentStyles = [styles.listContent];
    if (characterQuery && characterCountQueriedDiff) {
      listContentStyles.push({ paddingTop: 18 });
    }

    return (
      <View style={styles.container}>
        {characterQuery && characterCountQueriedDiff ? (
          <View style={styles.filterCount}>
            <Text style={styles.filterCountText}>
              Showing {characterCountQueried} Search Result
              {characterCountQueried === 1 ? '' : 's'}
            </Text>
          </View>
        ) : null}
        <FlatList
          ref={(component) => {
            this.listView = component;
          }}
          style={styles.list}
          data={this.props.characters}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
          getItemLayout={CharacterListScreen.getItemLayout}
          onScrollEndDrag={this.closeOpenSwipeable}
          contentContainerStyle={listContentStyles}
          ListFooterComponent={this.renderFooter}
          updateCellsBatchingPeriod={100}
          windowSize={42}
        />
        <ScrollView
          horizontal={true}
          onScrollBeginDrag={this.handleFloatingControlsScrollBeginDrag}
          onScrollEndDrag={this.handleFloatingControlsScrollEndDrag}
          // onMomentumScrollEnd={ this.handleFloatingControlsMomentumScrollEnd }
          pagingEnabled={true}
          ref={(component) => {
            this.floatingActionScrollView = component;
          }}
          removeClippedSubviews={true}
          showsHorizontalScrollIndicator={false}
          style={styles.floatingControls}
        >
          <View style={styles.selectedCharactersContainer}>
            <SelectedCharacters />
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.floatingControlsDivider} />
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={false}
              clearButtonMode={'always'}
              editable={this.state.searchInputEditable}
              placeholder={'Search by Name'}
              placeholderTextColor={colors.gray}
              ref={(component) => {
                this.searchInput = component;
              }}
              style={styles.searchInput}
              returnKeyType={'search'}
              onChange={this.handleSearchInputChange}
              onSubmitEditing={this.handleSearchInputSubmitEditing}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

CharacterListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,

  characters: PropTypes.array.isRequired,
  characterQuery: PropTypes.string.isRequired,
  characterCountTotal: PropTypes.number.isRequired,
  characterCountCompatible: PropTypes.number.isRequired,
  characterCountQueried: PropTypes.number.isRequired,

  updateCharacterQuery: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  characters: getCharactersSortedAndQueried(state),
  characterQuery: getQuery(state),
  characterCountTotal: getCharacterCountTotal(state),
  characterCountCompatible: getCharacterCountCompatible(state),
  characterCountQueried: getCharacterCountQueried(state),
});

const mapDispatchToProps = {
  updateCharacterQuery,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CharacterListScreen);
