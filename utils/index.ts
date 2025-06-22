export {
  addLogEntryToDb,
  addThingToDb,
  deleteLogEntryFromDb,
  deleteThingFromDb
} from './dbManipulations';
export { buildStartOfWeekDate, getWeekLabel } from './dateUtils';
export { fetchAndSetTotals } from './fetchAndSetTotals';
export { getAddLogEntryCount } from './getAddLogEntryCount';
export { incrementAddLogEntryCount } from './incrementAddLogEntryCount';
export { mapMinsAfterMidnightToTimeString } from './mapMinsAfterMidnightToTimeString';
export { migrateDbIfNeeded } from './migrateDbIfNeeded';
export { minutesAfterMidnightToTimeString } from './minutesAfterMidnightToTimeString';
export { normaliseFontSize } from './stylingUtils';
export { promptForRating } from './promptForRating';
export { promptForRatingIfAppropriate } from './promptForRatingIfAppropriate';
export { scheduleDailyNotifications } from './scheduleDailyNotifications';
