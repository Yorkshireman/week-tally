import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useColours, useGlobalStyles } from '@/hooks';

export default function TabsLayout() {
  const { headerTitleStyle } = useGlobalStyles();
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
        listeners={{
          tabPress: e => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        name='totals'
        options={{
          headerShown: false,

          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={24} />
          ),
          title: 'Totals'
        }}
      />
      <Tabs.Screen
        listeners={{
          tabPress: e => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
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
