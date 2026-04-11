import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/auth.store';
import { AuthStack } from './auth-stack';
import { MainStack } from './main-stack';

export function RootNavigation() {
  const { isLoggedIn, checkAuth } = useAuthStore();
  useEffect(() => { checkAuth(); }, []);
  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
