import { globalStyles } from '@/styles';
import { normaliseFontSize } from '@/utils';
import { Thing as ThingType } from '@/types';
import { useColours } from '@/hooks';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export const Thing = ({ thing }: { thing: ThingType }) => {
  const db = useSQLiteContext();
  const [isEnabled, setIsEnabled] = useState(Boolean(thing.currentlyTracking));
  const {
    primitiveNeutral,
    settingsScreen: { section: sectionColours }
  } = useColours();

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    try {
      if (isEnabled) {
        await db.runAsync('UPDATE things SET currentlyTracking = ? WHERE id = ?', [0, thing.id]);
      } else {
        await db.runAsync('UPDATE things SET currentlyTracking = ? WHERE id = ?', [1, thing.id]);
      }
    } catch (error) {
      console.error('Error updating thing:', error);
    }
  };

  return (
    <View style={{ ...globalStyles.settingsScreenSection, ...sectionColours }}>
      <Text style={styles.text}>{thing.title}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor='#3e3e3e'
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
