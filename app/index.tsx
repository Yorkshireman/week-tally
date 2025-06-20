import Background from '../assets/images/background.svg';
import Logo from '../assets/images/logo.svg';
import { useColours } from '@/hooks/useColours';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

const { width, height } = Dimensions.get('window');

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
    <View style={{ flex: 1 }}>
      <Background
        width={width}
        height={height}
        style={StyleSheet.absoluteFill}
        preserveAspectRatio='xMidYMid slice'
      />
      <View style={styles.container}>
        <View style={{ gap: height * 0.05 }}>
          <Logo width={width * 0.6} />
          <Pressable
            onPress={() => router.replace('/setupThings')}
            style={{ ...styles.buttonWrapper, backgroundColor: primitivePrimary[300] }}
          >
            <Text style={{ ...styles.buttonText, color: primitivePrimary[700] }}>
              Start your first tally
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: '10%'
  }
});
