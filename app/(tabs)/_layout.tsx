import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useColours } from '@/hooks';

export default function TabsLayout() {
  const {
    page: { backgroundColor },
    tabs: { active, borderColor, inactive },
    text: { color }
  } = useColours();

  const headerStyles = {
    headerShadowVisible: false,
    headerStyle: { backgroundColor },
    headerTintColor: color,
    headerTitleStyle: { fontSize: 25 }
  };

  const tabBarStyles = {
    tabBarActiveTintColor: active,
    tabBarInactiveTintColor: inactive,
    tabBarStyle: {
      backgroundColor,
      borderTopColor: borderColor,
      borderTopWidth: 1
    }
  };

  return (
    <Tabs
      screenOptions={{
        ...headerStyles,
        ...tabBarStyles
      }}
    >
      <Tabs.Screen
        name='totals'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={24} />
          ),
          title: 'Totals'
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />
          ),
          title: 'Settings'
        }}
      />
    </Tabs>
  );
}
