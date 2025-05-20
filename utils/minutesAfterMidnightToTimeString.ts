export const minutesAfterMidnightToTimeString = (minutesAfterMidnight: number): string => {
  const hour = Math.floor(minutesAfterMidnight / 60);
  const min = minutesAfterMidnight % 60;
  const period = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${min.toString().padStart(2, '0')}${period}`;
};
