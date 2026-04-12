import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

export function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const { register, loading, error } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // 入场动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!email || !password || !nickname) { 
      Alert.alert('提示', '请填写所有字段'); 
      return; 
    }
    if (password.length < 6) { 
      Alert.alert('提示', '密码至少 6 位'); 
      return; 
    }
    await register(email, password, nickname);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Animated.View 
        style={[
          styles.content, 
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🐾 PawMind</Text>
          <Text style={styles.title}>创建账号</Text>
          <Text style={styles.subtitle}>开始你的 AI 宠物陪伴之旅</Text>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="昵称" 
            placeholderTextColor={COLORS.textLight}
            value={nickname} 
            onChangeText={setNickname}
            autoComplete="name"
          />
          <TextInput 
            style={styles.input} 
            placeholder="邮箱" 
            placeholderTextColor={COLORS.textLight}
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextInput 
            style={styles.input} 
            placeholder="密码（至少 6 位）" 
            placeholderTextColor={COLORS.textLight}
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
            autoComplete="password"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister} 
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{loading ? '注册中...' : '注册'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.link}>已有账号？返回登录</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 PawMind. 保留所有权利</Text>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.lg },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOWS.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontSize: 14,
  },
  footer: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});
