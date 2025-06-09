import { Divider } from '@/components';
import { globalStyles } from '@/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColours } from '@/hooks';
import { View } from 'react-native';
import { ResetAppSection, SelectThingsSection } from '@/components/settingsScreen';

export default function Settings() {
  const {
    page: { backgroundColor }
  } = useColours();

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <View>
        <SelectThingsSection />
        <Divider />
        <ResetAppSection />
      </View>
    </SafeAreaView>
  );
}
