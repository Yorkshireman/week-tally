import { ThingWithLogEntriesCount } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { fetchDbChartThingId, fetchDbSettingsShowChart, setDbSettingsChartThingId } from '@/utils';

interface Params {
  setChartThingId: Dispatch<SetStateAction<string | null>>;
  setShowChart: Dispatch<SetStateAction<boolean>>;
  showChart: boolean;
  totals: ThingWithLogEntriesCount[] | undefined;
}

export const useSetShowChartAndChartThingId = ({
  setChartThingId,
  setShowChart,
  showChart,
  totals
}: Params) => {
  const isFocused = useIsFocused();
  const db = useSQLiteContext();

  useEffect(() => {
    const fetchAndSetShowChart = async () => {
      const isEnabled = await fetchDbSettingsShowChart(db);
      setShowChart(!!isEnabled);
    };

    fetchAndSetShowChart();
  }, [db, isFocused, setShowChart]);

  useEffect(() => {
    if (!showChart) {
      setDbSettingsChartThingId(db, '').then(() => setChartThingId(null));
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
          setChartThingId(null);
        }
      }
    };

    fetchAndSetChartThingId();
  }, [db, isFocused, setChartThingId, showChart, totals]);
};
