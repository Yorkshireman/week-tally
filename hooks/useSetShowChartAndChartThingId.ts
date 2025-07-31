import { ThingWithLogEntriesCount } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchDbChartThingId, fetchDbSettingsShowChart, setDbSettingsChartThingId } from '@/utils';

interface Params {
  setChartThingId: Dispatch<SetStateAction<string | undefined>>;
  totals: ThingWithLogEntriesCount[] | undefined;
}

export const useSetShowChartAndChartThingId = ({ setChartThingId, totals }: Params) => {
  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const [showChart, setShowChart] = useState<boolean>();

  useEffect(() => {
    const fetchAndSetShowChart = async () => {
      const isEnabled = await fetchDbSettingsShowChart(db);
      setShowChart(!!isEnabled);
    };

    fetchAndSetShowChart();
  }, [db, isFocused, setShowChart]);

  useEffect(() => {
    if (!showChart) {
      setDbSettingsChartThingId(db, '').then(() => setChartThingId(undefined));
      return;
    }

    const fetchAndSetChartThingId = async () => {
      const chartThingId = await fetchDbChartThingId(db);

      if (totals?.find(t => t.id === chartThingId)) {
        setChartThingId(chartThingId);
      } else {
        const firstTrackedThing = totals?.[0];

        if (firstTrackedThing) {
          setChartThingId(firstTrackedThing.id);
          await setDbSettingsChartThingId(db, firstTrackedThing.id);
        } else {
          setChartThingId(undefined);
        }
      }
    };

    fetchAndSetChartThingId();
  }, [db, isFocused, setChartThingId, showChart, totals]);

  return showChart;
};
