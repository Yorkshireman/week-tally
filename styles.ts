import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  headerTitleStyle: {
    fontSize: 18
  },
  screenWrapper: {
    flex: 1,
    gap: 40,
    paddingHorizontal: 25,
    paddingVertical: '25%'
  },
  settingsScreenSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -25,
    paddingHorizontal: 25,
    paddingVertical: 12
  }
});
