import { useColours } from '@/hooks/useColours';
import { StyleSheet, View } from 'react-native';

export const Divider = () => {
  const {
    divider: { backgroundColor }
  } = useColours();

  return <View style={{ ...styles.divider, backgroundColor }} />;
};

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%'
  }
});
