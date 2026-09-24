import { track as amplitudeTrack, init } from '@amplitude/analytics-react-native';
const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;

export const initializeAnalytics = () => {
  if (!apiKey) {
    console.warn('EXPO_PUBLIC_AMPLITUDE_API_KEY is not configured');
    return;
  }

  init(apiKey, undefined, {
    serverZone: 'EU',
    trackingSessionEvents: true
  });
};

export const track = (eventName: string, properties?: Record<string, unknown>) => {
  if (!apiKey) return;

  amplitudeTrack(eventName, properties);
};
