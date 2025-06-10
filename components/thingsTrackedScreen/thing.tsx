import { globalStyles } from '@/styles';
import { normaliseFontSize } from '@/utils';
import { Thing as ThingType } from '@/types';
import { updateCurrentlyTracking } from '@/utils/dbManipulations';
import { useColours } from '@/hooks';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export const Thing = ({ thing }: { thing: ThingType }) => {
  const db = useSQLiteContext();
  const [isEnabled, setIsEnabled] = useState(Boolean(thing.currentlyTracking));
  const {
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: { section: sectionColours }
  } = useColours();

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
      <Text style={styles.text}>{thing.title}</Text>
      <Switch
        trackColor={{ true: primitivePrimary[400] }}
        thumbColor={isEnabled ? '#fff' : primitiveNeutral[200]}
        ios_backgroundColor={primitiveNeutral[600]}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
