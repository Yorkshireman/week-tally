import { Thing } from '@/components/thingsTrackedScreen';
import { Thing as ThingType } from '@/types';
import { useSQLiteContext } from 'expo-sqlite';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function ThingsTracked() {
  const db = useSQLiteContext();
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
    <>
      {things.length > 0 ? (
        <View>
          {things.map(thing => (
            <Thing key={thing.id} thing={thing} />
          ))}
        </View>
      ) : (
        <Text>No things tracked yet.</Text>
      )}
    </>
  );
}
