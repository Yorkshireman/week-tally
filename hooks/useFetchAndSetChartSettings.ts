import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { ChartCurveType, ChartScale, ChartSize } from '@/types';
import {
  fetchDbSettingsChartCurveType,
  fetchDbSettingsChartScale,
  fetchDbSettingsChartSize,
  setDbSettingsChartCurveType,
  setDbSettingsChartScale,
  setDbSettingsChartSize
} from '@/utils';
import { useEffect, useState } from 'react';

export const useFetchAndSetChartSettings = () => {
  const [chartSize, setChartSize] = useState<ChartSize>();
  const [curveType, setCurveType] = useState<ChartCurveType>();
  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const [selectedScale, setSelectedScale] = useState<ChartScale>();

  useEffect(() => {
    const fetchChartScale = async () => {
      const scale = await fetchDbSettingsChartScale(db);
      if (scale) {
        setSelectedScale(scale);
      } else {
        setSelectedScale(ChartScale.MAX);
        setDbSettingsChartScale(db, ChartScale.MAX);
      }
    };

    const fetchChartSize = async () => {
      const size = await fetchDbSettingsChartSize(db);
      if (size) {
        setChartSize(size);
      } else {
        setDbSettingsChartSize(db, ChartSize.MEDIUM);
        setChartSize(ChartSize.MEDIUM);
      }
    };

    const fetchCurveType = async () => {
      const dbSettingsChartCurveType = await fetchDbSettingsChartCurveType(db);
      if (dbSettingsChartCurveType) {
        setCurveType(dbSettingsChartCurveType);
      } else {
        setDbSettingsChartCurveType(db, ChartCurveType.NATURAL);
        setCurveType(ChartCurveType.NATURAL);
      }
    };

    if (isFocused) {
      fetchChartScale();
      fetchChartSize();
      fetchCurveType();
    }
  }, [db, isFocused, setChartSize, setCurveType, setSelectedScale]);

  return { chartSize, curveType, selectedScale, setSelectedScale };
};
