import { StyleSheet, useWindowDimensions } from 'react-native';

export const useGlobalStyles = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return StyleSheet.create({
    content: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
    },
    headerTitleStyle: {
      fontSize: 18
    },
    screenWrapper: {
      alignSelf: isLargeScreen ? 'center' : 'auto',
      flex: 1,
      gap: isLargeScreen ? 60 : 40,
      maxWidth: 768,
      paddingHorizontal: isLargeScreen ? 80 : 25,
      paddingVertical: isLargeScreen ? 60 : '25%'
    },
    settingsScreenSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 25,
      paddingVertical: isLargeScreen ? 24 : 12
    }
  });
};
