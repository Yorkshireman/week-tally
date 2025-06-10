import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { useColours } from '@/hooks';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const SelectThingsSection = () => {
  const {
    primitiveNeutral,
    settingsScreen: { section: sectionColours }
  } = useColours();

  const router = useRouter();

  const onPress = () => {
    router.push('/thingsTracked');
  };

  return (
    <View style={{ ...globalStyles.settingsScreenSection, ...sectionColours }}>
      <Text style={styles.text}>Things tracked</Text>
      <Pressable onPress={onPress}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Text style={styles.text}>Select</Text>
          <Ionicons
            color={primitiveNeutral[400]}
            name='chevron-forward'
            size={normaliseFontSize(20)}
            style={{ alignSelf: 'flex-end', paddingBottom: 1 }}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
