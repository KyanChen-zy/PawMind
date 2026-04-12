import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { HomeScreen } from '../screens/home/home-screen';
import { ChatScreen } from '../screens/chat/chat-screen';
import { HealthScreen } from '../screens/health/health-screen';
import { GrowthScreen } from '../screens/growth/growth-screen';
import { ProfileScreen } from '../screens/profile/profile-screen';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 8,
          paddingBottom: 12,
          height: 60,
          ...SHADOWS.sm
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -4
        },
        tabBarIconStyle: {
          marginBottom: 4
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: '首页', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Text style={{ fontSize: 22, color }}>🏠</Text>
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          tabBarLabel: 'AI陪伴', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Text style={{ fontSize: 22, color }}>💬</Text>
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="Health" 
        component={HealthScreen} 
        options={{ 
          tabBarLabel: '健康', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Text style={{ fontSize: 22, color }}>📊</Text>
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="Growth" 
        component={GrowthScreen} 
        options={{ 
          tabBarLabel: '成长册', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Text style={{ fontSize: 22, color }}>📸</Text>
            </View>
          ) 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: '我的', 
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Text style={{ fontSize: 22, color }}>👤</Text>
            </View>
          ) 
        }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary + '20'
  }
});
