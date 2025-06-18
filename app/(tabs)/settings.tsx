import { Divider } from '@/components';
import { globalStyles } from '@/styles';
import { useColours } from '@/hooks';
import {
  ChangeNotificationTimeSection,
  ResetAppSection,
  SelectThingsSection
} from '@/components/settingsScreen';
import { SafeAreaView, View } from 'react-native';

export default function Settings() {
  const {
    page: { backgroundColor }
  } = useColours();

  return (
    <SafeAreaView>
      <View style={{ ...globalStyles.screenWrapper, backgroundColor, paddingVertical: 0 }}>
        <View>
          <ChangeNotificationTimeSection />
          <Divider />
          <SelectThingsSection />
          <Divider />
          <ResetAppSection />
        </View>
      </View>
    </SafeAreaView>
  );
}
