import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { addThingToDb, deleteThingFromDb } from '@/utils';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View
} from 'react-native';
import { ListItemProps, Thing } from '../types';
import { useColours, useDbLogger } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

const ListItem = ({ id, setListData, title }: ListItemProps) => {
  const {
    iconButton,
    text: { color }
  } = useColours();
  const colourScheme = useColorScheme();
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();

  const onPressDeleteButton = async () => {
    Alert.alert(
      'Are you sure?',
      '',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: async () => {
            try {
              await deleteThingFromDb(db, id);
              setListData(prev => prev.filter(item => item.id !== id));
            } catch (e) {
              console.error('DB error: ', e);
            }

            logDbContents();
          },
          style: 'destructive',
          text: 'Delete'
        }
      ],
      { userInterfaceStyle: colourScheme === 'dark' ? 'dark' : 'light' }
    );
  };

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 40,
        justifyContent: 'space-between'
      }}
    >
      <Text style={{ ...styles.listItemText, color }}>{title}</Text>
      <Pressable
        onPress={onPressDeleteButton}
        style={{ borderColor: iconButton.borderColor, borderRadius: 7, borderWidth: 2, padding: 5 }}
      >
        <Ionicons color={iconButton.color} name='trash' size={24} />
      </Pressable>
    </View>
  );
};

export default function Index() {
  const [checkingSetupStatus, setCheckingSetupStatus] = useState(true);
  const {
    button: { primary },
    page: { backgroundColor },
    text: { color }
  } = useColours();
  const db = useSQLiteContext();
  const flatListRef = useRef<FlatList>(null);
  const [listData, setListData] = useState<Thing[]>([]);
  const logDbContents = useDbLogger();
  const router = useRouter();
  const [text, onChangeText] = useState('');

  useEffect(() => {
    const populateListDataStateFromDb = async () => {
      try {
        const dbThings: Thing[] = await db.getAllAsync('SELECT * from things');
        setListData(dbThings);
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
    const now = new Date().toISOString();

    try {
      await addThingToDb(db, id, now, text);
      setListData(prev => [
        ...prev,
        { createdAt: now, currentlyTracking: 1, id, title: text.trim(), updatedAt: now }
      ]);

      onChangeText('');
    } catch (e) {
      console.error('DB error: ', e);
    }

    logDbContents();
  };

  if (checkingSetupStatus) {
    return null;
  }

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <FlatList
          data={listData}
          ListHeaderComponent={
            <>
              <Text style={{ ...styles.text, color, fontWeight: 'bold', marginBottom: 20 }}>
                1. Enter the things you would like to track
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                value={text}
                placeholder={`Thing ${listData.length + 1}`}
              />
            </>
          }
          ref={flatListRef}
          renderItem={({ item: { id, title } }) => (
            <ListItem key={id} id={id} setListData={setListData} title={title} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          style={styles.list}
        />
      </KeyboardAvoidingView>
      <View style={{ alignItems: 'center' }}>
        {listData.length ? (
          <View>
            <Text style={{ ...styles.text, color, marginBottom: 20 }}>Finished?</Text>
            <Pressable
              onPress={() => router.replace('/dateTimeChooser')}
              style={{ ...styles.nextStepButton, ...primary }}
            >
              <Text style={{ ...styles.nextStepButtonText, color: primary.color }}>
                Go to next step
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
    paddingHorizontal: '10%',
    paddingTop: 40
  },
  content: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40
  },
  input: {
    borderWidth: 1,
    fontSize: 20,
    marginBottom: 40,
    padding: 10
  },
  list: {
    alignSelf: 'stretch',
    marginBottom: 20
  },
  listItemText: {
    flexShrink: 1,
    fontSize: 24,
    fontWeight: 'bold'
  },
  nextStepButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: 163
  },
  nextStepButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  }
});
