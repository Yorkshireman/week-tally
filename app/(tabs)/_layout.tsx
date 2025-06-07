import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useColours } from '@/hooks';

export default function TabsLayout() {
  const {
    page: { backgroundColor },
    text: { color }
  } = useColours();

  const headerStyles = {
    headerStyle: {
      backgroundColor,
      borderBottomColor: color,
      borderBottomWidth: 1
    },
    headerTintColor: color,
    headerTitleStyle: {
      fontSize: 20
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#25292e'
        },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#ffd33d',
        tabBarStyle: {
          backgroundColor: '#25292e'
        }
      }}
    >
      <Tabs.Screen
        name='totals'
        options={{
          ...headerStyles,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
          title: 'Totals'
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          ...headerStyles,
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
