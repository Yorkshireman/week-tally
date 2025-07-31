import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialDesignIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { ChartCurveType, ChartSize } from '@/types';
import {
  fetchDbFirstCurrentlyTrackedThing,
  normaliseFontSize,
  setDbSettingsChartCurveType,
  setDbSettingsChartSize
} from '@/utils';
import { setDbSettingsChartThingId, setDbSettingsShowChart } from '@/utils/dbManipulations';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useColours, useFetchAndSetChartSettings, useGlobalStyles } from '@/hooks';

export const ChartSettingsSection = () => {
  const { chartSize, curveType, setChartSize, setCurveType, setShowChart, showChart } =
    useFetchAndSetChartSettings();
  const db = useSQLiteContext();
  const globalStyles = useGlobalStyles();
  const {
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: { radioButton, section: sectionColours },
    text: { color }
  } = useColours();

  const toggleSwitch = async () => {
    setShowChart(previousState => !previousState);

    if (showChart) {
      await setDbSettingsShowChart(db, 'false');
      await setDbSettingsChartThingId(db, '');
    } else {
      await setDbSettingsShowChart(db, 'true');
      fetchDbFirstCurrentlyTrackedThing(db).then(thing =>
        setDbSettingsChartThingId(db, thing?.id || '')
      );
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
            thumbColor={showChart ? '#fff' : primitiveNeutral[200]}
            trackColor={{ true: primitivePrimary[400] }}
            value={showChart}
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
                setChartSize(size);
              }}
            >
              <Ionicons
                name={chartSize === size ? 'radio-button-on' : 'radio-button-off'}
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
                setCurveType(type);
              }}
              style={styles.curveTypeOption}
            >
              <MaterialDesignIcons
                name={type === ChartCurveType.LINEAR ? 'triangle-wave' : 'sine-wave'}
                size={24}
                color={primitivePrimary[400]}
              />
              <Ionicons
                name={curveType === type ? 'radio-button-on' : 'radio-button-off'}
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
