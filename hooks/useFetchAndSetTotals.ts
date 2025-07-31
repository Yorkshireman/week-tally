import { AppState } from 'react-native';
import { fetchAndSetTotals } from '@/utils';
import { ThingWithLogEntriesCount } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface Params {
  setTotals: Dispatch<SetStateAction<ThingWithLogEntriesCount[] | undefined>>;
  setWeekOffset: Dispatch<SetStateAction<number>>;
  weekOffset: number;
}

export const useFetchAndSetTotals = ({ setTotals, setWeekOffset, weekOffset }: Params) => {
  const appState = useRef(AppState.currentState);
  const db = useSQLiteContext();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchAndSetTotals(db, setTotals, weekOffset);
    // Listen for app coming to the foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active' && isFocused) {
        fetchAndSetTotals(db, setTotals, weekOffset);
        setWeekOffset(0);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [db, isFocused, setTotals, setWeekOffset, weekOffset]);
};
