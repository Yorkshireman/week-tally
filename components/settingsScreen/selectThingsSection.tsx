import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColours, useGlobalStyles } from '@/hooks';

export const SelectThingsSection = () => {
  const globalStyles = useGlobalStyles();
  const {
    primitiveNeutral,
    settingsScreen: { section: sectionColours },
    text: { color }
  } = useColours();

  const router = useRouter();

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/thingsTracked');
  };

  return (
    <View style={{ ...globalStyles.settingsScreenSection, ...sectionColours }}>
      <Text style={{ ...styles.text, color }}>Things tracked</Text>
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Text style={{ ...styles.text, color }}>Select</Text>
          <Ionicons
            color={primitiveNeutral[400]}
            name='chevron-forward'
            size={normaliseFontSize(20)}
            style={{ alignSelf: 'flex-end', paddingBottom: 1 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
