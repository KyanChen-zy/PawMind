import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/auth.store';
import { AuthStack } from './auth-stack';
import { MainStack } from './main-stack';
import { COLORS } from '../constants/theme';

export function RootNavigation() {
  const { isLoggedIn, loading, checkAuth } = useAuthStore();

  useEffect(() => { checkAuth(); }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
