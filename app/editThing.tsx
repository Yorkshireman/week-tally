import { globalStyles } from '@/styles';
import { normaliseFontSize } from '@/utils';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useColours, useDbLogger } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

export default function EditThing() {
  const {
    input,
    page: { backgroundColor }
  } = useColours();
  const db = useSQLiteContext();
  const inputRef = useRef<TextInput>(null);
  const logDbContents = useDbLogger();
  const navigation = useNavigation();
  const {
    params: { id, title }
  } = useRoute() as { params: { id: string; title: string } };
  const [text, onChangeText] = useState(title);
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

    if (trimmed === title) {
      setError('The name is unchanged.');
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

    try {
      const now = new Date().toISOString();
      await db.runAsync(
        'UPDATE things SET title = ?, updatedAt = ? WHERE id = ?',
        trimmed,
        now,
        id
      );

      onChangeText('');
      navigation.goBack();
    } catch (e) {
      console.error('DB error: ', e);
      setError('An error occurred while updating the Thing.');
    }

    logDbContents();
  };

  return (
    <View style={{ ...globalStyles.screenWrapper, backgroundColor, paddingVertical: 25 }}>
      <TextInput
        ref={inputRef}
        returnKeyType='done'
        style={{ ...styles.input, ...input }}
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
