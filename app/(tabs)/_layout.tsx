import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useColours } from '@/hooks';

export default function TabsLayout() {
  const {
    page: { backgroundColor },
    text: { color }
  } = useColours();

  const headerStyles = {
    headerShadowVisible: false,
    headerStyle: { backgroundColor },
    headerTintColor: color,
    headerTitleStyle: { fontSize: 25 }
  };

  return (
    <Tabs
      screenOptions={{
        ...headerStyles,
        tabBarActiveTintColor: '#ffd33d',
        tabBarStyle: {
          backgroundColor: '#25292e'
        }
      }}
    >
      <Tabs.Screen
        name='totals'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
          title: 'Totals'
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              color={color}
              size={24}
            />
          ),
          title: 'Settings'
        }}
      />
    </Tabs>
  );
}
