import { promptForRating } from './promptForRating';

export const promptForRatingIfAppropriate = async (currentAddLogEntryCount: number | null) => {
  if (currentAddLogEntryCount === null) {
    return await promptForRating();
  }

  if (currentAddLogEntryCount > 0 && currentAddLogEntryCount % 10 === 0) {
    return await promptForRating();
  }

  return null;
};
