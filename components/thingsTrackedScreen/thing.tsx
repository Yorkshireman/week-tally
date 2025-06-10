import { Divider } from '../divider';
import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Menu } from 'react-native-paper';
import { normaliseFontSize } from '@/utils';
import { Thing as ThingType } from '@/types';
import { updateCurrentlyTracking } from '@/utils/dbManipulations';
import { useColours } from '@/hooks';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

type SetThings = React.Dispatch<React.SetStateAction<ThingType[]>>;

export const Thing = ({ setThings, thing }: { setThings: SetThings; thing: ThingType }) => {
  const db = useSQLiteContext();
  const [isEnabled, setIsEnabled] = useState(Boolean(thing.currentlyTracking));
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: { section: sectionColours }
  } = useColours();

  const handleDelete = async (id: string) => {
    try {
      await db.runAsync('DELETE FROM things WHERE id = ?', id);
      setThings(prevThings => prevThings.filter((thing: ThingType) => thing.id !== id));
    } catch (error) {
      console.error(`Error deleting Thing with id ${id}:`, error);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      `Are you sure you want to delete "${thing.title}"?`,
      'This will delete all data, including past logs and totals for this Thing, and cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          onPress: () => handleDelete(thing.id),
          style: 'destructive',
          text: 'Delete'
        }
      ],
      { cancelable: true }
    );
  };

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    try {
      if (isEnabled) {
        await updateCurrentlyTracking(db, 0, thing.id);
      } else {
        await updateCurrentlyTracking(db, 1, thing.id);
      }
    } catch (error) {
      console.error(
        `Error updating currentlyTracking for Thing: ${thing.title}, id: ${thing.id}`,
        error
      );
    }
  };

  return (
    <View
      style={{ ...globalStyles.settingsScreenSection, ...sectionColours, alignItems: 'center' }}
    >
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.text}>
          {thing.title}
        </Text>
      </View>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
        <Menu
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name='ellipsis-vertical' size={24} color={primitivePrimary[900]} />
            </TouchableOpacity>
          }
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
        >
          <View style={{ maxWidth: 250, paddingHorizontal: 16, paddingVertical: 6 }}>
            <Text style={{ fontSize: normaliseFontSize(16), marginBottom: 16 }}>{thing.title}</Text>
            <Divider />
          </View>
          <Menu.Item
            leadingIcon='trash-can-outline'
            onPress={() => {
              setMenuVisible(false);
              showDeleteAlert();
            }}
            title='Delete'
          />
        </Menu>
        <Switch
          trackColor={{ true: primitivePrimary[400] }}
          thumbColor={isEnabled ? '#fff' : primitiveNeutral[200]}
          ios_backgroundColor={primitiveNeutral[600]}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'left'
  }
});
