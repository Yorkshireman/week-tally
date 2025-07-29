import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialDesignIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { ChartCurveType, ChartSize } from '@/types';
import {
  fetchDbFirstCurrentlyTrackedThing,
  fetchDbSettingsChartCurveType,
  fetchDbSettingsChartSize,
  fetchDbSettingsShowChart,
  normaliseFontSize,
  setDbSettingsChartCurveType,
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
  const [selectedCurveType, setSelectedCurveType] = useState<ChartCurveType>();
  const [selectedSize, setSelectedSize] = useState<ChartSize>();
  const {
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: { radioButton, section: sectionColours },
    text: { color }
  } = useColours();

  useEffect(() => {
    const fetchDbSettings = async () => {
      try {
        const showChartQueryResult = await fetchDbSettingsShowChart(db);
        setIsEnabled(!!showChartQueryResult);

        const dbSettingsChartCurveType = await fetchDbSettingsChartCurveType(db);
        if (dbSettingsChartCurveType) {
          setSelectedCurveType(dbSettingsChartCurveType);
        } else {
          setDbSettingsChartCurveType(db, ChartCurveType.NATURAL);
          setSelectedCurveType(ChartCurveType.NATURAL);
        }

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

  const curveTypeOptions = [ChartCurveType.LINEAR, ChartCurveType.NATURAL];
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
              style={styles.sizeOption}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await setDbSettingsChartSize(db, size);
                setSelectedSize(size);
              }}
            >
              <Ionicons
                name={selectedSize === size ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={radioButton.color}
              />
              <Text style={{ color, ...styles.sizeText }}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ ...globalStyles.settingsScreenSection, flexDirection: 'column', gap: 16 }}>
          {curveTypeOptions.map(type => (
            <TouchableOpacity
              key={type}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await setDbSettingsChartCurveType(db, type);
                setSelectedCurveType(type);
              }}
              style={styles.curveTypeOption}
            >
              <MaterialDesignIcons
                name={type === ChartCurveType.LINEAR ? 'triangle-wave' : 'sine-wave'}
                size={24}
                color={primitivePrimary[400]}
              />
              <Ionicons
                name={selectedCurveType === type ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={radioButton.color}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  curveTypeOption: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between'
  },
  heading: {
    fontSize: normaliseFontSize(16),
    fontWeight: 'bold',
    marginBottom: 8,
    paddingLeft: 25
  },
  sizeOption: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  sizeText: {
    fontSize: normaliseFontSize(16),
    marginLeft: 8
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
