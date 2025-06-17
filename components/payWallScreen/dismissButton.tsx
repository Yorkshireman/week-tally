import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';

const color = '#718096';

interface PageStyles {
  paddingHorizontal: number;
  paddingTop: number;
}

export const DismissButton = ({ pageStyles }: { pageStyles: PageStyles }) => {
  const [canDismiss, setCanDismiss] = useState(false);
  const [countdown, setCountdown] = useState(4);
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
    <>
      {canDismiss ? (
        <TouchableOpacity
          onPress={router.back}
          style={{
            padding: 8,
            position: 'absolute',
            right: pageStyles.paddingHorizontal,
            top: pageStyles.paddingTop,
            zIndex: 10
          }}
          hitSlop={10}
        >
          <Ionicons style={{ color }} name='close' size={28} />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            alignItems: 'center',
            height: 44,
            justifyContent: 'center',
            position: 'absolute',
            right: pageStyles.paddingHorizontal,
            top: pageStyles.paddingTop,
            width: 44,
            zIndex: 10
          }}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons style={{ color }} name='reload' size={28} />
          </Animated.View>
          <Text style={{ color, fontWeight: 'bold', position: 'absolute' }}>{countdown}</Text>
        </View>
      )}
    </>
  );
};
