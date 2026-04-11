import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../constants/theme';
import { HomeScreen } from '../screens/home/home-screen';
import { ChatScreen } from '../screens/chat/chat-screen';
import { HealthScreen } from '../screens/health/health-screen';
import { GrowthScreen } from '../screens/growth/growth-screen';
import { ProfileScreen } from '../screens/profile/profile-screen';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.primary, tabBarInactiveTintColor: COLORS.textSecondary }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '首页', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: 'AI陪伴', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💬</Text> }} />
      <Tab.Screen name="Health" component={HealthScreen} options={{ tabBarLabel: '健康', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text> }} />
      <Tab.Screen name="Growth" component={GrowthScreen} options={{ tabBarLabel: '成长册', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📸</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: '我的', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}
