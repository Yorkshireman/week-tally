import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';

export default function ConfirmationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 20 }}>
          You&apos;re done!
        </Text>
        <Text style={{ ...styles.text, marginBottom: 20 }}>
          You&apos;ll get daily notifications asking you to say whether or not you have done your
          Thing, and on Sunday you&apos;ll get a notification inviting you to view your weekly
          totals.
        </Text>
        <Text style={styles.text}>
          Come back here anytime to view your running totals or update a total if you missed a
          notification.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D0FEF5',
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40
  },
  text: {
    color: '#2D2A32',
    fontSize: 20,
    textAlign: 'center'
  }
});
