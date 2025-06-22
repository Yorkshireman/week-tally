import * as StoreReview from 'expo-store-review';

export const promptForRating = async () => {
  if (await StoreReview.isAvailableAsync()) {
    // This may or may not actually show the prompt (Apple limits frequency to ~3 per year)
    await StoreReview.requestReview();
    console.log('Store review prompt requested');
  } else {
    console.log('Store review prompt not available');
  }
};
