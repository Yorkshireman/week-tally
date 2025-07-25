import { normaliseFontSize } from '@/utils';
import { setDbSettingsShowChart } from '@/utils/dbManipulations';
import type { Setting } from '@/types';
import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useColours, useGlobalStyles } from '@/hooks';
import { useEffect, useState } from 'react';

export const ChartSettingsSection = () => {
  const db = useSQLiteContext();
  const globalStyles = useGlobalStyles();
  const [isEnabled, setIsEnabled] = useState(true);
  const {
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: { section: sectionColours },
    text: { color }
  } = useColours();

  useEffect(() => {
    const fetchDbSettings = async () => {
      try {
        const result: Setting | null = await db.getFirstAsync(
          'SELECT value FROM settings WHERE key = ?',
          'showChart'
        );

        if (!result || !result.value) {
          return;
        }

        const isEnabled = result.value === 'true';
        setIsEnabled(isEnabled);
      } catch (error) {
        console.error('Error fetching Chart Visible setting: ', error);
      }
    };

    fetchDbSettings();
  }, [db]);

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    try {
      if (isEnabled) {
        await setDbSettingsShowChart(db, false);
      } else {
        await setDbSettingsShowChart(db, true);
      }
    } catch (error) {
      console.error('Error updating Chart Visible setting: ', error);
    }
  };

  return (
    <>
      <Text style={{ ...styles.heading, color }}>Chart</Text>
      <View
        style={{
          ...globalStyles.settingsScreenSection,
          ...sectionColours,
          alignItems: 'center'
        }}
      >
        <Text numberOfLines={1} style={{ ...styles.toggleText, color }}>
          Visible
        </Text>
        <Switch
          ios_backgroundColor={primitiveNeutral[600]}
          onValueChange={toggleSwitch}
          thumbColor={isEnabled ? '#fff' : primitiveNeutral[200]}
          trackColor={{ true: primitivePrimary[400] }}
          value={isEnabled}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  heading: {
    fontSize: normaliseFontSize(16),
    fontWeight: 'bold',
    marginBottom: 8,
    paddingLeft: 25
  },
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  },
  toggleText: {
    fontSize: normaliseFontSize(18),
    textAlign: 'left'
  }
});
