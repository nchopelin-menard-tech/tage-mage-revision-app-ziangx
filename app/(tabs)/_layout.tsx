
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import FloatingTabBar from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs = [
    {
      name: '(home)',
      title: 'Accueil',
      icon: 'house.fill',
      route: '/(tabs)/(home)',
    },
    {
      name: 'admission',
      title: 'Admission',
      icon: 'graduationcap.fill',
      route: '/(tabs)/admission',
    },
    {
      name: 'profile',
      title: 'Profil',
      icon: 'person.fill',
      route: '/(tabs)/profile',
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
        tabBar={() => Platform.OS === 'ios' ? <FloatingTabBar tabs={tabs} /> : <FloatingTabBar tabs={tabs} />}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Accueil',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="admission"
          options={{
            title: 'Admission',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
