import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { useColours } from '@/hooks';
import { StyleSheet, Text, View } from 'react-native';

export const SelectThingsSection = () => {
  const {
    primitiveNeutral,
    settingsScreen: { section }
  } = useColours();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: -25,
        paddingHorizontal: 25,
        paddingVertical: 12,
        ...section
      }}
    >
      <Text style={styles.text}>Things tracked</Text>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <Text style={styles.text}>Select</Text>
        <Ionicons
          color={primitiveNeutral[400]}
          name='chevron-forward'
          size={normaliseFontSize(20)}
          style={{ alignSelf: 'flex-end', paddingBottom: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
