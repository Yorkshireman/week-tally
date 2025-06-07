import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
    // screenOptions={{
    //   headerShown: false,
    //   tabBarActiveTintColor: '#000',
    //   tabBarInactiveTintColor: '#888',
    //   tabBarStyle: {
    //     backgroundColor: '#fff',
    //     borderTopWidth: 0,
    //     elevation: 0,
    //     shadowOpacity: 0
    //   }
    // }}
    >
      <Tabs.Screen name='totals' options={{ headerShown: false }} />
      <Tabs.Screen name='settings' options={{ headerShown: false }} />
    </Tabs>
  );
}
