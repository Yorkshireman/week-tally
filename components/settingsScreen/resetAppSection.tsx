import { Alert, Pressable, StyleSheet, Text, useColorScheme, View, ViewStyle } from 'react-native';
import { useColours, useResetApp } from '@/hooks';

export const ResetAppSection = ({ sectionStyles }: { sectionStyles: ViewStyle | ViewStyle[] }) => {
  const colourScheme = useColorScheme();
  const resetApp = useResetApp();
  const {
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
    <View style={sectionStyles}>
      <Pressable
        onPress={onPressResetAppButton}
        style={{ ...styles.resetButton, backgroundColor: warning.backgroundColor }}
      >
        <Text style={{ ...styles.resetButtonText, color: warning.color }}>Reset the app</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    borderRadius: 10,
    padding: 10,
    width: 150
  },
  resetButtonText: {
    fontSize: 18,
    textAlign: 'center'
  }
});
