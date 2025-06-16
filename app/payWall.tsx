import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { useColours } from '@/hooks';
import { useRouter } from 'expo-router';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function PayWall() {
  const {
    text: { color }
  } = useColours();

  const router = useRouter();
  const [canDismiss, setCanDismiss] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const spinAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    setCanDismiss(false);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanDismiss(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canDismiss) {
      Animated.loop(
        Animated.timing(spinAnim, {
          duration: 800,
          easing: Easing.linear,
          toValue: 1,
          useNativeDriver: true
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [canDismiss, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.page}>
      {canDismiss ? (
        <TouchableOpacity
          onPress={router.back}
          style={{
            padding: 8,
            position: 'absolute',
            right: styles.page.paddingHorizontal,
            top: styles.page.paddingTop,
            zIndex: 10
          }}
          hitSlop={10}
        >
          <Ionicons style={{ color: '#4A5568' }} name='close' size={28} color={color} />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            alignItems: 'center',
            height: 44,
            justifyContent: 'center',
            position: 'absolute',
            right: styles.page.paddingHorizontal,
            top: styles.page.paddingTop,
            width: 44,
            zIndex: 10
          }}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons style={{ color: '#4A5568' }} name='reload' size={28} />
          </Animated.View>
          <Text style={{ color: '#4A5568', fontWeight: 'bold', position: 'absolute' }}>
            {countdown}
          </Text>
        </View>
      )}
      <View style={globalStyles.content}>
        <Text style={{ ...styles.text, marginBottom: 20 }}>
          Be fleeced by the developers of this app and pay for the privilege of using it.
        </Text>
      </View>
      <View style={{ alignSelf: 'stretch', gap: 20 }}>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            ...styles.tryForFreeButton,
            backgroundColor: '#2078C9'
          }}
        >
          <Text style={{ ...styles.tryForFreeButtonText, color: 'white' }}>Try for Free</Text>
          <Ionicons
            name='chevron-forward'
            size={normaliseFontSize(20)}
            style={{ ...styles.tryForFreeButtonIcon, color: 'white' }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15
  },
  backButtonText: {
    fontSize: 18,
    textAlign: 'center'
  },
  page: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 72
  },
  text: {
    fontSize: 18,
    textAlign: 'center'
  },
  tryForFreeButton: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 18
  },
  tryForFreeButtonIcon: {
    marginLeft: 5
  },
  tryForFreeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
