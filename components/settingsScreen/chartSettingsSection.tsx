import { ChartSize } from '@/types';
import { useSQLiteContext } from 'expo-sqlite';
import {
  fetchDbFirstCurrentlyTrackedThing,
  fetchDbSettingsChartSize,
  fetchDbSettingsShowChart,
  normaliseFontSize,
  setDbSettingsChartSize
} from '@/utils';
import { setDbSettingsChartThingId, setDbSettingsShowChart } from '@/utils/dbManipulations';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useColours, useGlobalStyles } from '@/hooks';
import { useEffect, useState } from 'react';

export const ChartSettingsSection = () => {
  const db = useSQLiteContext();
  const globalStyles = useGlobalStyles();
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedSize, setSelectedSize] = useState<ChartSize>();
  const {
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: { section: sectionColours },
    text: { color }
  } = useColours();

  useEffect(() => {
    const fetchDbSettings = async () => {
      try {
        const showChartQueryResult = await fetchDbSettingsShowChart(db);
        setIsEnabled(!!showChartQueryResult);

        const chartSizeQueryResult = await fetchDbSettingsChartSize(db);
        if (chartSizeQueryResult) {
          setSelectedSize(chartSizeQueryResult);
        } else {
          await setDbSettingsChartSize(db, ChartSize.MEDIUM);
          setSelectedSize(ChartSize.MEDIUM);
        }
      } catch (error) {
        console.error('Error fetching DB Chart settings: ', error);
      }
    };

    fetchDbSettings();
  }, [db]);

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    try {
      if (isEnabled) {
        await setDbSettingsShowChart(db, 'false');
        await setDbSettingsChartThingId(db, '');
      } else {
        await setDbSettingsShowChart(db, 'true');
        fetchDbFirstCurrentlyTrackedThing(db).then(thing =>
          setDbSettingsChartThingId(db, thing?.id || '')
        );
      }
    } catch (error) {
      console.error('Error updating Chart Visible setting: ', error);
    }
  };

  const sizeOptions = [ChartSize.SMALL, ChartSize.MEDIUM, ChartSize.LARGE];

  return (
    <>
      <Text style={{ ...styles.heading, color }}>Chart</Text>
      <View style={sectionColours}>
        <View
          style={{
            ...globalStyles.settingsScreenSection,
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
        <View style={globalStyles.settingsScreenSection}>
          {sizeOptions.map(size => (
            <TouchableOpacity
              key={size}
              style={{
                alignItems: 'center',
                flexDirection: 'row'
              }}
              onPress={async () => {
                await setDbSettingsChartSize(db, size);
                setSelectedSize(size);
              }}
            >
              <View
                style={{
                  backgroundColor: selectedSize === size ? color : 'transparent',
                  borderColor: color,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  height: 20,
                  width: 20
                }}
              />
              <Text style={{ color, marginLeft: 8 }}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
