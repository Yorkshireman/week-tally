import { SafeAreaView } from 'react-native-safe-area-context';
import { useColours } from '@/hooks';
import { useResetApp } from '@/hooks/useResetApp';
import { Alert, Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

export default function Settings() {
  const colourScheme = useColorScheme();
  const resetApp = useResetApp();
  const {
    page: { backgroundColor },
    text: { color },
    button: { warning }
  } = useColours();

  const onPressResetAppButton = async () => {
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
    <SafeAreaView style={{ ...styles.container, backgroundColor }}>
      <Pressable
        onPress={onPressResetAppButton}
        style={{ ...styles.resetButton, backgroundColor: warning.backgroundColor }}
      >
        <Text style={{ ...styles.resetButtonText, color: warning.color }}>Reset the app</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '10%'
  },
  resetButton: {
    borderRadius: 10,
    padding: 10,
    width: 150
  },
  resetButtonText: {
    fontSize: 18,
    textAlign: 'center'
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  }
});
