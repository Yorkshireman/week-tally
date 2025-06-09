import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { Thing } from '@/components/thingsTrackedScreen';
import { Thing as ThingType } from '@/types';
import { useColours } from '@/hooks';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function ThingsTracked() {
  const { primitiveInfo } = useColours();
  const db = useSQLiteContext();
  const router = useRouter();
  const [things, setThings] = useState<ThingType[]>([]);

  useEffect(() => {
    const fetchAndSetThings = async () => {
      console.log(`Fetching all Things`);

      const things = await db.getAllAsync<ThingType>(
        'SELECT * FROM things ORDER BY createdAt DESC'
      );

      console.log(`Found ${things.length} Things: ${JSON.stringify(things, null, 2)}`);
      setThings(things);
    };

    fetchAndSetThings().catch(error => {
      console.error('Error fetching things:', error);
    });
  }, [db]);

  return (
    <View style={{ ...globalStyles.screenWrapper, gap: 16, paddingVertical: 16 }}>
      <Text
        style={{
          backgroundColor: primitiveInfo[600],
          borderRadius: 10,
          color: 'white',
          fontSize: normaliseFontSize(16),
          padding: 16
        }}
      >
        When untracking a Thing, no data is deleted, and its totals will still show up in past
        weeks, but it will no longer be displayed in your current week&apos;s totals.{'\n\n'}Anytime
        you want to start tracking it again, just toggle it back on.
      </Text>
      <View style={{ gap: 5 }}>
        {things.map(thing => (
          <Thing key={thing.id} thing={thing} />
        ))}
        <Ionicons
          name='add-circle-outline'
          size={normaliseFontSize(32)}
          color={primitiveInfo[600]}
          style={{ alignSelf: 'center' }}
          onPress={() => {
            router.push('/addThing');
          }}
        />
      </View>
    </View>
  );
}
