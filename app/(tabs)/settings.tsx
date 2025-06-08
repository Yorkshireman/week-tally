import { globalStyles } from '@/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColours } from '@/hooks';
import { useResetApp } from '@/hooks/useResetApp';
import { Alert, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

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
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <View style={globalStyles.content}>
        <Pressable
          onPress={onPressResetAppButton}
          style={{ ...styles.resetButton, backgroundColor: warning.backgroundColor }}
        >
          <Text style={{ ...styles.resetButtonText, color: warning.color }}>Reset the app</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
