import { Divider } from '@/components';
import {
  ChangeNotificationTimeSection,
  ChartSettingsSection,
  ResetAppSection,
  SelectThingsSection
} from '@/components/settingsScreen';
import { SafeAreaView, View } from 'react-native';
import { useColours, useGlobalStyles } from '@/hooks';

export default function Settings() {
  const globalStyles = useGlobalStyles();
  const {
    page: { backgroundColor }
  } = useColours();

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <View style={{ paddingTop: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <ChartSettingsSection />
        </View>
        <ChangeNotificationTimeSection />
        <Divider />
        <SelectThingsSection />
        <Divider />
        <ResetAppSection />
      </View>
    </SafeAreaView>
  );
}
