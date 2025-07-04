import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { Thing } from '@/components/thingsTrackedScreen';
import { Thing as ThingType } from '@/types';
import { useSQLiteContext } from 'expo-sqlite';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useColours, useGlobalStyles } from '@/hooks';
import { useFocusEffect, useRouter } from 'expo-router';

export default function ThingsTracked() {
  const {
    page: { backgroundColor },
    thingsTrackedScreen: {
      addButton: { color: addButtonColor },
      infoBoxBackgroundColour
    }
  } = useColours();
  const db = useSQLiteContext();
  const globalStyles = useGlobalStyles();
  const router = useRouter();
  const [things, setThings] = useState<ThingType[]>([]);

  const fetchAndSetThings = useCallback(async () => {
    console.log(`Fetching all Things`);
    const things = await db.getAllAsync<ThingType>('SELECT * FROM things ORDER BY createdAt DESC');
    console.log(`Found ${things.length} Things: ${JSON.stringify(things, null, 2)}`);
    setThings(things);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      fetchAndSetThings();
    }, [fetchAndSetThings])
  );

  const renderThings = () => {
    const trackedThings = things.filter(thing => thing.currentlyTracking);
    const untrackedThings = things.filter(thing => !thing.currentlyTracking);
    return (
      <>
        {trackedThings.map(thing => (
          <Thing key={thing.id} setThings={setThings} thing={thing} />
        ))}
        {untrackedThings.map(thing => (
          <Thing key={thing.id} setThings={setThings} thing={thing} />
        ))}
      </>
    );
  };

  return (
    <ScrollView
      style={{
        ...globalStyles.screenWrapper,
        backgroundColor,
        paddingVertical: 16
      }}
    >
      <Text
        style={{
          backgroundColor: infoBoxBackgroundColour,
          borderRadius: 10,
          color: 'white',
          fontSize: normaliseFontSize(16),
          marginBottom: 16,
          padding: 16
        }}
      >
        When untracking a Thing, no data is deleted, and its totals will still show up in past
        weeks, but it will no longer be displayed in your current week&apos;s totals.{'\n\n'}
        Anytime you want to start tracking it again, just toggle it back on.
      </Text>
      <View style={{ gap: 5 }}>
        {renderThings()}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/addThing');
          }}
          style={{ alignSelf: 'center', marginTop: 5 }}
        >
          <Ionicons name='add-circle-outline' size={normaliseFontSize(48)} color={addButtonColor} />
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </View>
    </ScrollView>
  );
}
