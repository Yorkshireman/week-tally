import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { useColours } from '@/hooks';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PayWall() {
  const {
    text: { color }
  } = useColours();

  const router = useRouter();

  return (
    <View style={{ ...globalStyles.screenWrapper, backgroundColor: 'white' }}>
      <TouchableOpacity
        onPress={router.back}
        style={{
          padding: 8,
          position: 'absolute',
          right: 20,
          top: 20,
          zIndex: 10
        }}
        hitSlop={10}
      >
        <Ionicons name='close' size={28} color={color} />
      </TouchableOpacity>
      <View style={globalStyles.content}>
        <Text style={{ ...styles.text, color, marginBottom: 20 }}>
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
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  },
  tryForFreeButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15
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
