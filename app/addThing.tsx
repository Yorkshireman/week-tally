import { globalStyles } from '@/styles';
import { useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { addThingToDb, normaliseFontSize } from '@/utils';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useColours, useDbLogger } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

export default function AddThing() {
  const {
    input,
    page: { backgroundColor }
  } = useColours();
  const db = useSQLiteContext();
  const inputRef = useRef<TextInput>(null);
  const logDbContents = useDbLogger();
  const navigation = useNavigation();
  const [text, onChangeText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmitEditing = async () => {
    const trimmed = text.trim();
    if (trimmed === '') {
      setError('Please enter a name.');
      return;
    }
    // Check for duplicates (case-insensitive)
    const existing = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM things WHERE LOWER(title) = ?',
      trimmed.toLowerCase()
    );

    if (existing) {
      setError('A Thing with this name already exists.');
      return;
    }

    setError(null);

    const id = uuid.v4();
    const now = new Date().toISOString();

    try {
      await addThingToDb(db, id, now, trimmed);
      onChangeText('');
      navigation.goBack();
    } catch (e) {
      console.error('DB error: ', e);
      setError('An error occurred while adding the Thing.');
    }

    logDbContents();
  };

  return (
    <View style={{ ...globalStyles.screenWrapper, backgroundColor, paddingVertical: 25 }}>
      <TextInput
        ref={inputRef}
        returnKeyType='done'
        style={{ ...styles.input, ...input }}
        placeholderTextColor={input.placeholderTextColor}
        onChangeText={t => {
          onChangeText(t);
          if (error) setError(null);
        }}
        onSubmitEditing={onSubmitEditing}
        value={text}
        placeholder={'Thing'}
      />
      {error && (
        <Text style={{ ...styles.errorText, color: input.validationErrorText.color }}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: normaliseFontSize(16),
    marginTop: -30,
    textAlign: 'left'
  },
  input: {
    borderWidth: 1,
    fontSize: normaliseFontSize(24),
    padding: 10,
    width: '100%'
  }
});
