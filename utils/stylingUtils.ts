import { Dimensions } from 'react-native';

export const normaliseFontSize = (size: number) => {
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;
  const scale = isLargeScreen ? width / 700 : width / 425;

  return Math.round(size * scale);
};
