import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { addThingToDb, deleteThingFromDb, normaliseFontSize } from '@/utils';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { ListItemProps, Thing } from '../types';
import { useColours, useDbLogger, useGlobalStyles } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

const ListItem = ({ id, setListData, title }: ListItemProps) => {
  const {
    iconButton,
    text: { color },
    thingSection: { backgroundColor }
  } = useColours();
  const colourScheme = useColorScheme();
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();

  const onPressDeleteButton = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        backgroundColor,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
      }}
    >
      <Text style={{ ...styles.listItemText, color }}>{title}</Text>
      <TouchableOpacity
        onPress={onPressDeleteButton}
        style={{ borderColor: iconButton.borderColor, borderRadius: 7, borderWidth: 2, padding: 5 }}
      >
        <Ionicons color={iconButton.color} name='trash' size={normaliseFontSize(24)} />
      </TouchableOpacity>
    </View>
  );
};

export default function SetupThingsScreen() {
  const {
    button: { primary },
    input,
    page: { backgroundColor },
    text: { color }
  } = useColours();
  const db = useSQLiteContext();
  const flatListRef = useRef<FlatList>(null);
  const globalStyles = useGlobalStyles();
  const [listData, setListData] = useState<Thing[]>([]);
  const logDbContents = useDbLogger();
  const router = useRouter();
  const [text, onChangeText] = useState('');

  useEffect(() => {
    const populateListDataStateFromDb = async () => {
      try {
        const dbThings: Thing[] = await db.getAllAsync(
          'SELECT * from things ORDER BY createdAt DESC'
        );

        setListData(dbThings);
      } catch (e) {
        console.error('DB error: ', e);
      }
    };

    populateListDataStateFromDb();
  }, [db, router]);

  const onPressNextStepButton = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/dateTimeChooser');
  };

  const onSubmitEditing = async () => {
    if (text.trim() === '') {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <FlatList
        data={listData}
        ListHeaderComponent={
          <View style={{ gap: 40 }}>
            <Text
              style={{
                ...styles.text,
                color,
                fontSize: normaliseFontSize(20),
                fontWeight: 'bold'
              }}
            >
              Enter the things you would like to track
            </Text>
            <Text style={{ ...styles.text, color }}>
              They can be absolutely anything you like, and it is completely private.
            </Text>
            <Text style={{ ...styles.text, color }}>
              You can add as many as you like, and you can always add more later.
            </Text>

            <TextInput
              returnKeyType='done'
              style={{ ...styles.input, ...input }}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmitEditing}
              placeholderTextColor={input.placeholderTextColor}
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
      {listData.length ? (
        <View style={{ alignSelf: 'stretch' }}>
          <TouchableOpacity
            onPress={onPressNextStepButton}
            style={{ ...styles.nextStepButton, ...primary }}
          >
            <Text style={{ ...styles.nextStepButtonText, color: primary.color }}>
              Go to next step
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: normaliseFontSize(24),
    marginBottom: 40,
    padding: 10
  },
  list: {
    alignSelf: 'stretch'
  },
  listItemText: {
    flexShrink: 1,
    fontSize: normaliseFontSize(24),
    fontWeight: 'bold'
  },
  nextStepButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15
  },
  nextStepButtonText: {
    fontSize: normaliseFontSize(18),
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
