import { Picker } from '@react-native-picker/picker';

interface TimePickerProps {
  selectedTime: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
}

export const TimePicker = ({ selectedTime, onValueChange }: TimePickerProps) => {
  return (
    <Picker
      selectedValue={selectedTime}
      style={{ alignSelf: 'stretch' }}
      onValueChange={onValueChange}
    >
      {/* values are no. of minutes after midnight */}
      <Picker.Item label='6pm' value='1080' />
      <Picker.Item label='6:30pm' value='1110' />
      <Picker.Item label='7pm' value='1140' />
      <Picker.Item label='7:30pm' value='1170' />
      <Picker.Item label='8pm' value='1200' />
      <Picker.Item label='8:30pm' value='1230' />
      <Picker.Item label='9pm' value='1260' />
      <Picker.Item label='9:30pm' value='1270' />
      <Picker.Item label='10pm' value='1320' />
      <Picker.Item label='10:30pm' value='1350' />
      <Picker.Item label='11pm' value='1380' />
      <Picker.Item label='11:30pm' value='1410' />
    </Picker>
  );
};
