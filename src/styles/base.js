import { StyleSheet } from 'react-native';

import colors from './colors';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },

  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  // FORM ELEMENTS

  button: {
    backgroundColor: colors.brand,
    borderRadius: 8,
    padding: 16,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    color: colors.darkGray,
    fontSize: 16,
    padding: 16,
  },

  // COMPONENTS

  floatingControls: {
    backgroundColor: colors.darkGrayTranslucent90,
    bottom: 0,
    left: 0,
    padding: 12,
    position: 'absolute',
    right: 0,
  },
});
