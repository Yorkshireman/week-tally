export const buildStartOfWeekDate = (now: Date, weekOffset = 0): Date => {
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = day === 0 ? 6 : day - 1; // 0 if Monday, 1 if Tuesday, ..., 6 if Sunday
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday + weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

export const getWeekLabel = (offset: number) => {
  if (offset === 0) return 'This week';
  if (offset === -1) return 'Last week';
  if (offset < -1) return `${Math.abs(offset)} weeks ago`;
  return '';
};
