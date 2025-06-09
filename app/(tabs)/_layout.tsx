import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useColours } from '@/hooks';

const { headerTitleStyle } = globalStyles;

export default function TabsLayout() {
  const { header, tabBar } = useColours();

  const headerStyles = {
    ...header,
    headerTitleStyle
  };

  return (
    <Tabs
      screenOptions={{
        ...headerStyles,
        ...tabBar
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
