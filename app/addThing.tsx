import { globalStyles } from '@/styles';
import { useDbLogger } from '@/hooks';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import uuid from 'react-native-uuid';
import { addThingToDb, normaliseFontSize } from '@/utils';
import { StyleSheet, TextInput, View } from 'react-native';

export default function AddThing() {
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();
  const navigation = useNavigation();
  const [text, onChangeText] = useState('');

  const onSubmitEditing = async () => {
    if (text.trim() === '') {
      return;
    }

    const id = uuid.v4();
    const now = new Date().toISOString();

    try {
      await addThingToDb(db, id, now, text);
      onChangeText('');
      navigation.goBack();
    } catch (e) {
      console.error('DB error: ', e);
    }

    logDbContents();
  };

  return (
    <View style={{ ...globalStyles.screenWrapper, paddingVertical: 25 }}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        value={text}
        placeholder={'Thing'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: normaliseFontSize(24),
    marginBottom: 40,
    padding: 10,
    width: '100%'
  }
});
