import { Tabs } from 'expo-router';

import { colors } from '@/src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.backgroundDeep,
          borderTopColor: colors.glassBorder,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Breathe',
        }}
      />
      <Tabs.Screen
        name="sand"
        options={{
          title: 'Sand',
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: 'Garden',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
