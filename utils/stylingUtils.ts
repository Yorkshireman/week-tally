import { Dimensions } from 'react-native';

export const normaliseFontSize = (size: number) => {
  const { width } = Dimensions.get('window');
  const scale = width / 425;

  return Math.round(size * scale);
};
