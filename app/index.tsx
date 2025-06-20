import { useColours } from '@/hooks/useColours';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function Index() {
  const [checkingSetupStatus, setCheckingSetupStatus] = useState(true);
  const { primitivePrimary } = useColours();
  const db = useSQLiteContext();
  const router = useRouter();

  useEffect(() => {
    const redirectToTotalsScreenIfSetupComplete = async () => {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM settings WHERE key = ?',
        'setupComplete'
      );

      if (row?.value === 'true') {
        router.replace('/totals');
      } else {
        setCheckingSetupStatus(false);
      }
    };

    redirectToTotalsScreenIfSetupComplete();
  }, [db, router]);

  if (checkingSetupStatus) {
    return null;
  }

  return (
    <ImageBackground
      source={require('../assets/images/welcome-screen.png')}
      style={styles.background}
      resizeMode='cover'
    >
      <View style={styles.container}>
        <Pressable
          onPress={() => router.replace('/setupThings')}
          style={{ ...styles.buttonWrapper, backgroundColor: primitivePrimary[300] }}
        >
          <Text
            style={{
              ...styles.buttonText,

              color: primitivePrimary[700]
            }}
          >
            Start your first tally
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttonWrapper: {
    borderRadius: 10,
    padding: 18
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
    paddingBottom: 48
  }
});
