# Welcome to Week Tally 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Dev Notes

### How to manually add a log entry to the database

```typescript
import uuid from 'react-native-uuid';
...
const firstThing = await db.getFirstAsync<Thing>('SELECT * FROM things');
const nowIso = new Date().toISOString();
const entryId = uuid.v4();

await db.execAsync(
   `INSERT INTO entries (id, thingId, timestamp) VALUES ('${entryId}', '${firstThing?.id}', '${nowIso}');`
);
```

### How to run a preview build on physical device

- Add device to list of approved devices: `eas device:create`
- `eas build --platform ios --profile preview`
- Navigate to latest build: https://expo.dev/accounts/codedegen/projects/times-this-week/builds
- Click "Install" and follow instructions

### How to create a production build

- `eas build --platform ios --profile production`

### How to submit a production build to Apple App Store Connect

- `eas submit --platform ios`

### Analytics

Production analytics: https://app.eu.amplitude.com/analytics/codedegen/space/product-analytics/product-overview?app=100056358
