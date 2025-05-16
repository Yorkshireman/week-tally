import { ListItemProps } from './indexTypes';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import uuid from 'react-native-uuid';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ListItem = ({ id, setListData, title }: ListItemProps) => {
  const db = useSQLiteContext();

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
      <Text style={styles.text}>{title}</Text>
      <Button
        onPress={async () => {
          setListData(prev => prev.filter(item => item.id !== id));
          await db.runAsync('DELETE FROM things WHERE id = ?', id);
        }}
        title='Delete'
      />
    </View>
  );
};

export default function Index() {
  const db = useSQLiteContext();
  const [listData, setListData] = useState<{ id: string; title: string }[]>([]);
  const [text, onChangeText] = useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 20 }}>
            1. Enter the things you would like to track
          </Text>
          <Text style={{ ...styles.text, marginBottom: 20 }}>
            For best results, write what fits the sentence, &quot;Have you (something) today?&quot;
          </Text>
          <FlatList
            data={listData}
            renderItem={({ item: { id, title } }) => (
              <ListItem key={id} id={id} setListData={setListData} title={title} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            style={{ marginBottom: 20 }}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            onSubmitEditing={async () => {
              if (text.trim()) {
                const id = uuid.v4() as string;
                setListData(prev => [...prev, { id, title: text }]);
                onChangeText('');
                await db.runAsync('INSERT INTO things (id, title) VALUES (?, ?)', id, text);
              }
            }}
            value={text}
            placeholder={`Thing ${listData.length + 1}`}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D0FEF5',
    flex: 1
  },
  content: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40
  },
  input: {
    borderWidth: 1,
    height: 40,
    minWidth: 200,
    padding: 10
  },
  text: {
    color: '#2D2A32',
    fontSize: 20,
    textAlign: 'center'
  }
});
