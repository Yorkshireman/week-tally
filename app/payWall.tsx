import { DismissButton } from '@/components/payWallScreen';
import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PayWall() {
  return (
    <View style={styles.page}>
      <DismissButton pageStyles={styles.page} />
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
