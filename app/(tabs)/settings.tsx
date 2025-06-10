import { Divider } from '@/components';
import { globalStyles } from '@/styles';
import { useColours } from '@/hooks';
import { View } from 'react-native';
import { ResetAppSection, SelectThingsSection } from '@/components/settingsScreen';

export default function Settings() {
  const {
    page: { backgroundColor }
  } = useColours();

  return (
    <View style={{ ...globalStyles.screenWrapper, backgroundColor, paddingVertical: 0 }}>
      <View>
        <SelectThingsSection />
        <Divider />
        <ResetAppSection />
      </View>
    </View>
  );
}
