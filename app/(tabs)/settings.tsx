import { Divider } from '@/components';
import { globalStyles } from '@/styles';
import { ResetAppSection } from '@/components/settingsScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColours } from '@/hooks';
import { StyleSheet, View } from 'react-native';

export default function Settings() {
  const {
    page: { backgroundColor }
  } = useColours();

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <View style={globalStyles.content}>
        <Divider />
        <ResetAppSection sectionStyles={styles.section} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 12
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  }
});
