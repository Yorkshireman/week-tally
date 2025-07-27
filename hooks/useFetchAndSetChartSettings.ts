import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { ChartScale, ChartSize } from '@/types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  fetchDbSettingsChartScale,
  fetchDbSettingsChartSize,
  setDbSettingsChartScale,
  setDbSettingsChartSize
} from '@/utils';

type Params = {
  setChartSize: Dispatch<SetStateAction<ChartSize | undefined>>;
  setSelectedScale: Dispatch<SetStateAction<ChartScale | null>>;
};

export const useFetchAndSetChartSettings = ({ setChartSize, setSelectedScale }: Params) => {
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

    if (isFocused) {
      fetchChartScale();
      fetchChartSize();
    }
  }, [db, isFocused, setChartSize, setSelectedScale]);
};
