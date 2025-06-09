import { globalStyles } from '@/styles';
import { normaliseFontSize } from '@/utils';
import { Thing as ThingType } from '@/types';
import { useColours } from '@/hooks';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export const Thing = ({ thing }: { thing: ThingType }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const {
    primitiveNeutral,
    settingsScreen: { section: sectionColours }
  } = useColours();

  return (
    <View style={{ ...globalStyles.settingsScreenSection, ...sectionColours }}>
      <Text style={styles.text}>{thing.title}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor='#3e3e3e'
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
