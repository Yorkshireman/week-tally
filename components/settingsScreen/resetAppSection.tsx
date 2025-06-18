import * as Haptics from 'expo-haptics';
import { globalStyles } from '@/styles';
import { normaliseFontSize } from '@/utils';
import { Alert, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useColours, useResetApp } from '@/hooks';

export const ResetAppSection = () => {
  const colourScheme = useColorScheme();
  const resetApp = useResetApp();
  const {
    primitiveError,
    settingsScreen: { section: sectionColours }
  } = useColours();

  const onPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Are you sure?',
      'This will delete all of your data within this app and reset the app to its initial state. Only do this if you are 100% sure. This action cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            await resetApp();
          },
          style: 'destructive',
          text: 'Reset the app'
        }
      ],
      { userInterfaceStyle: colourScheme === 'dark' ? 'dark' : 'light' }
    );
  };

  return (
    <View
      style={{ ...globalStyles.settingsScreenSection, justifyContent: 'center', ...sectionColours }}
    >
      <Pressable onPress={onPress}>
        <Text style={{ ...styles.text, color: primitiveError[500] }}>Reset the app</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
