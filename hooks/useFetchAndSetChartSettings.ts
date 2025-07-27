import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { ChartCurveType, ChartScale, ChartSize } from '@/types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  fetchDbSettingsChartCurveType,
  fetchDbSettingsChartScale,
  fetchDbSettingsChartSize,
  setDbSettingsChartCurveType,
  setDbSettingsChartScale,
  setDbSettingsChartSize
} from '@/utils';

type Params = {
  setChartSize: Dispatch<SetStateAction<ChartSize | undefined>>;
  setCurveType: Dispatch<SetStateAction<ChartCurveType | undefined>>;
  setSelectedScale: Dispatch<SetStateAction<ChartScale | null>>;
};

export const useFetchAndSetChartSettings = ({
  setChartSize,
  setCurveType,
  setSelectedScale
}: Params) => {
  const db = useSQLiteContext();
  const isFocused = useIsFocused();

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
};
