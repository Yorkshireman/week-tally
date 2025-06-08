import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { addThingToDb, deleteThingFromDb } from '@/utils';
import {
  Alert,
  FlatList,
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
        { createdAt: now, currentlyTracking: 1, id, title: text.trim(), updatedAt: now },
        ...prev
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
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center'
          }}
          data={listData}
          ListHeaderComponent={
            <View style={{ gap: 40 }}>
              <Text style={{ ...styles.text, color, fontWeight: 'bold' }}>
                1. Enter the things you would like to track
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                value={text}
                placeholder={`Thing ${listData.length + 1}`}
              />
            </View>
          }
          ref={flatListRef}
          renderItem={({ item: { id, title } }) => (
            <ListItem key={id} id={id} setListData={setListData} title={title} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          style={styles.list}
        />
      </View>
      {listData.length ? (
        <View style={{ alignSelf: 'stretch' }}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingHorizontal: '25%',
    paddingVertical: '25%'
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    borderWidth: 1,
    fontSize: 20,
    marginBottom: 40,
    padding: 10
  },
  list: {
    alignSelf: 'stretch'
  },
  listItemText: {
    flexShrink: 1,
    fontSize: 24,
    fontWeight: 'bold'
  },
  nextStepButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15
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
