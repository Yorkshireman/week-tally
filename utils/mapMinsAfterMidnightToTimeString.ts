export const mapMinsAfterMidnightToTimeString = (mins: string): string => {
  switch (mins) {
    case '1080':
      return '6pm';
    case '1110':
      return '6:30pm';
    case '1140':
      return '7pm';
    case '1170':
      return '7:30pm';
    case '1200':
      return '8pm';
    case '1230':
      return '8:30pm';
    case '1260':
      return '9pm';
    case '1290':
      return '9:30pm';
    case '1320':
      return '10pm';
    case '1350':
      return '10:30pm';
    case '1380':
      return '11pm';
    case '1410':
      return '11:30pm';
    default:
      return 'Unknown time';
  }
};
