import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function DateTimeChooserScreen() {
  const [selectedTime, setSelectedTime] = useState();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 20 }}>
          2. Choose when you&apos;d like to be notified
        </Text>
        <Text style={{ ...styles.text, marginBottom: 20 }}>
          The app will send you a notification at a set time of your choosing each day to ask you if
          you have done your Thing that day.
        </Text>
        <Picker
          selectedValue={selectedTime}
          style={{ alignSelf: 'stretch' }}
          onValueChange={itemValue => setSelectedTime(itemValue)}
        >
          {/* values are no. of minutes after midnight */}
          <Picker.Item label='6pm' value='1080' />
          <Picker.Item label='6:30pm' value='1110' />
          <Picker.Item label='7pm' value='1140' />
          <Picker.Item label='7:30pm' value='1170' />
          <Picker.Item label='8pm' value='1200' />
          <Picker.Item label='8:30pm' value='1230' />
          <Picker.Item label='9pm' value='1260' />
          <Picker.Item label='9:30pm' value='1270' />
          <Picker.Item label='10pm' value='1320' />
          <Picker.Item label='10:30pm' value='1350' />
          <Picker.Item label='11pm' value='1380' />
          <Picker.Item label='11:30pm' value='1410' />
        </Picker>
        <View>
          <Text style={{ ...styles.text, marginBottom: 10 }}>Finished?</Text>
          <Link href='/dateTimeChooser' style={{ ...styles.navigationButton, marginBottom: 20 }}>
            Go to next step
          </Link>
          <Pressable onPress={() => router.dismissTo('/')}>
            <Text style={styles.navigationButton}>Go back</Text>
          </Pressable>
        </View>
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
  navigationButton: {
    color: '#007AFF',
    fontSize: 20,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  text: {
    color: '#2D2A32',
    fontSize: 20,
    textAlign: 'center'
  }
});
