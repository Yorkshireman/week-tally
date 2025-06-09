import { Text } from 'react-native';
import { Thing as ThingType } from '@/types';

export const Thing = ({ thing }: { thing: ThingType }) => {
  return <Text>{thing.title}</Text>;
};
