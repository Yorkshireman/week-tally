import { SafeAreaView } from 'react-native-safe-area-context';
import { useDbLogger } from '@/hooks';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { ListItemProps, Thing } from '../types';
import { useEffect, useRef, useState } from 'react';

const ListItem = ({ id, setListData, title }: ListItemProps) => {
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 40,
        justifyContent: 'space-between',
        marginHorizontal: '11%'
      }}
    >
      <Text style={styles.listItemText}>{title}</Text>
      <Pressable
        onPress={async () => {
          setListData(prev => prev.filter(item => item.id !== id));
          await db.runAsync('DELETE FROM things WHERE id = ?', id);
          logDbContents();
        }}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    </View>
  );
};

export default function Index() {
  const [checkingSetupStatus, setCheckingSetupStatus] = useState(true);
  const db = useSQLiteContext();
  const flatListRef = useRef<FlatList>(null);
  const [listData, setListData] = useState<Thing[]>([]);
  const logDbContents = useDbLogger();
  const router = useRouter();
  const [text, onChangeText] = useState('');

  useEffect(() => {
    const populateListDataStateFromDb = async () => {
      try {
        const result: Thing[] = await db.getAllAsync('SELECT * from things');
        setListData(result.map(({ id, title }) => ({ id, title })));
      } catch (e) {
        console.error('DB error: ', e);
      }
    };

    const redirectToTotalsScreenIfSetupComplete = async () => {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM settings WHERE key = ?',
        'setupComplete'
      );

      if (row?.value === 'true') {
        router.replace('/totals');
      } else {
        setCheckingSetupStatus(false);
      }
    };

    redirectToTotalsScreenIfSetupComplete();
    populateListDataStateFromDb();
  }, [db, router]);

  const onSubmitEditing = async () => {
    if (text.trim() === '') {
      return;
    }

    const id = uuid.v4();
    setListData(prev => [...prev, { id, title: text.trim() }]);
    onChangeText('');
    await db.runAsync('INSERT INTO things (id, title) VALUES (?, ?)', id, text);
    logDbContents();
  };

  if (checkingSetupStatus) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 20 }}>
          1. Enter the things you would like to track
        </Text>
        <Text style={{ ...styles.text, marginBottom: 20 }}>
          For best results, write what fits the sentence, &quot;Have you done (something)
          today?&quot;
        </Text>
        <FlatList
          data={listData}
          ref={flatListRef}
          renderItem={({ item: { id, title } }) => (
            <ListItem key={id} id={id} setListData={setListData} title={title} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          onContentSizeChange={() => {
            if (listData.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          style={styles.list}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          value={text}
          placeholder={`Thing ${listData.length + 1}`}
        />
        {listData.length ? (
          <View>
            <Text style={{ ...styles.text, marginBottom: 20 }}>Finished?</Text>
            <Pressable
              onPress={() => router.replace('/dateTimeChooser')}
              style={styles.nextStepButton}
            >
              <Text style={styles.nextStepButtonText}>Go to next step</Text>
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FEFD',
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40
  },
  deleteButton: {
    backgroundColor: '#FAF089',
    borderRadius: 10,
    padding: 7,
    width: 85
  },
  deleteButtonText: {
    color: '#2D3748',
    fontSize: 18,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    fontSize: 20,
    marginBottom: 40,
    padding: 10,
    width: '78%'
  },
  list: {
    alignSelf: 'stretch',
    marginBottom: 20,
    maxHeight: '80%'
  },
  listItemText: {
    color: '#2D3748',
    flexShrink: 1,
    fontSize: 24,
    fontWeight: 'bold'
  },
  nextStepButton: {
    backgroundColor: '#156F6D',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    width: 160
  },
  nextStepButtonText: {
    color: '#F0FEFD',
    fontSize: 18,
    textAlign: 'center'
  },
  text: {
    color: '#2D3748',
    fontSize: 20,
    textAlign: 'center'
  }
});
