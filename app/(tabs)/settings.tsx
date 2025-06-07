import { useColours } from '@/hooks';
import { Text, View } from 'react-native';

export default function Settings() {
  const {
    page: { backgroundColor },
    text: { color }
  } = useColours();

  return (
    <View
      style={{
        backgroundColor,
        flex: 1,
        padding: 20
      }}
    >
      <Text style={{ color, marginTop: 20 }}>
        This is a placeholder for settings. You can add your settings options here.
      </Text>
    </View>
  );
}
