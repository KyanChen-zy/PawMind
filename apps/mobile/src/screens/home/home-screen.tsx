import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import { StatusCard } from '../../components/ui/status-card';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../../constants/theme';

export function HomeScreen({ navigation }: any) {
  const { currentPet, fetchPets } = usePetStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    fetchPets();
  }, []);

  // 入场动画：在 currentPet 变化时重新触发
  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);

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

    // 呼吸动画
    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    loopAnimation.start();

    return () => {
      loopAnimation.stop();
    };
  }, [currentPet?.id]);

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Animated.Text 
            style={[
              styles.emptyIcon, 
              {
                opacity: fadeAnim, 
                transform: [
                  { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
                  { rotate: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '0deg'] }) }
                ]
              }
            ]}
          >
            🐾
          </Animated.Text>
          <Animated.Text style={[styles.emptyTitle, { opacity: fadeAnim, marginTop: SPACING.lg }]}>
            先来认识一下你的宠物吧
          </Animated.Text>
          <Animated.Text style={[styles.emptySubtitle, { opacity: fadeAnim, marginTop: SPACING.sm }]}>
            创建宠物档案，开启 AI 陪伴之旅
          </Animated.Text>
          <Animated.View 
            style={[
              styles.addButton, 
              {
                opacity: fadeAnim, 
                transform: [
                  { translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                  { scale: bounceAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddPet')}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>开始建档</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.header, 
            {
              opacity: fadeAnim,
              transform: [
                { translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }
              ]
            }
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>🐾 PawMind</Text>
            <Text style={styles.headerSubtitle}>AI 宠物陪伴助手</Text>
          </View>
          <TouchableOpacity style={styles.petSwitch} onPress={() => {}}>
            <View style={styles.petAvatar}>
              <Text style={styles.petAvatarIcon}>🐶</Text>
            </View>
            <View style={styles.petSwitchInfo}>
              <Text style={styles.petSwitchLabel}>当前宠物</Text>
              <Text style={styles.petSwitchText}>{currentPet.name}</Text>
            </View>
            <Text style={styles.petSwitchIcon}>▼</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.content, 
            {
              opacity: fadeAnim, 
              transform: [
                { translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <StatusCard petName={currentPet.name} emotion="happy" summary="今天在家超级开心，吃了两顿美味的饭，还玩了好久的玩具！" />
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.7}
            >
              <Animated.View 
                style={[
                  styles.actionIconContainer, 
                  styles.chatIcon,
                  {
                    transform: [
                      { scale: bounceAnim.interpolate({ inputRange: [1, 1.05], outputRange: [1, 1.1] }) }
                    ]
                  }
                ]}
              >
                <Text style={styles.actionIcon}>💬</Text>
              </Animated.View>
              <Text style={styles.actionLabel}>AI 陪伴</Text>
              <Text style={styles.actionSubLabel}>和宠物聊天</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => navigation.navigate('Health')}
              activeOpacity={0.7}
            >
              <Animated.View 
                style={[
                  styles.actionIconContainer, 
                  styles.healthIcon,
                  {
                    transform: [
                      { scale: bounceAnim.interpolate({ inputRange: [1, 1.05], outputRange: [1, 1.1] }) }
                    ]
                  }
                ]}
              >
                <Text style={styles.actionIcon}>📊</Text>
              </Animated.View>
              <Text style={styles.actionLabel}>健康管理</Text>
              <Text style={styles.actionSubLabel}>记录健康数据</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => navigation.navigate('Growth')}
              activeOpacity={0.7}
            >
              <Animated.View 
                style={[
                  styles.actionIconContainer, 
                  styles.growthIcon,
                  {
                    transform: [
                      { scale: bounceAnim.interpolate({ inputRange: [1, 1.05], outputRange: [1, 1.1] }) }
                    ]
                  }
                ]}
              >
                <Text style={styles.actionIcon}>📸</Text>
              </Animated.View>
              <Text style={styles.actionLabel}>成长记录</Text>
              <Text style={styles.actionSubLabel}>拍照留念</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsTitle}>宠物小贴士</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.tipsMore}>更多</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Text style={styles.tipIcon}>💡</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>定期梳理毛发</Text>
                <Text style={styles.tipText}>定期为宠物梳理毛发，有助于保持皮肤健康，减少脱毛</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.dailyChallenge}>
            <Text style={styles.challengeTitle}>今日挑战</Text>
            <View style={styles.challengeCard}>
              <Text style={styles.challengeIcon}>🎯</Text>
              <Text style={styles.challengeText}>和宠物互动 10 分钟</Text>
              <TouchableOpacity style={styles.challengeButton} onPress={() => navigation.navigate('Chat')}>
                <Text style={styles.challengeButtonText}>开始</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.md, 
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg
  },
  headerLeft: {
    flex: 1
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  petSwitch: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.primary + '15', 
    paddingHorizontal: SPACING.md, 
    paddingVertical: SPACING.sm, 
    borderRadius: BORDER_RADIUS.md
  },
  petAvatar: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm
  },
  petAvatarIcon: {
    fontSize: 16
  },
  petSwitchInfo: {
    marginRight: SPACING.sm
  },
  petSwitchLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginBottom: 2
  },
  petSwitchText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600'
  },
  petSwitchIcon: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600'
  },
  content: { 
    paddingBottom: SPACING.xxl 
  },
  empty: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: SPACING.xl,
    backgroundColor: COLORS.surface
  },
  emptyIcon: {
    fontSize: 100
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl
  },
  addButton: { 
    backgroundColor: COLORS.primary, 
    borderRadius: BORDER_RADIUS.lg, 
    paddingHorizontal: SPACING.xl, 
    paddingVertical: SPACING.md,
    ...SHADOWS.md
  },
  addButtonText: {
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '700'
  },
  quickActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: SPACING.lg, 
    marginHorizontal: SPACING.md, 
    backgroundColor: COLORS.surface, 
    borderRadius: BORDER_RADIUS.xl, 
    padding: SPACING.lg,
    ...SHADOWS.md
  },
  actionItem: {
    alignItems: 'center',
    flex: 1
  },
  actionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  chatIcon: { 
    backgroundColor: COLORS.primary + '20',
    borderWidth: 2,
    borderColor: COLORS.primary + '40'
  },
  healthIcon: { 
    backgroundColor: COLORS.secondary + '20',
    borderWidth: 2,
    borderColor: COLORS.secondary + '40'
  },
  growthIcon: { 
    backgroundColor: COLORS.accent1 + '20',
    borderWidth: 2,
    borderColor: COLORS.accent1 + '40'
  },
  actionIcon: {
    fontSize: 36
  },
  actionLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: SPACING.xs
  },
  actionSubLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2
  },
  tipsSection: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text
  },
  tipsMore: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600'
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm
  },
  tipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.accent2 + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md
  },
  tipIcon: {
    fontSize: 24
  },
  tipContent: {
    flex: 1
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20
  },
  dailyChallenge: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent1 + '20',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.accent1 + '40'
  },
  challengeIcon: {
    fontSize: 32,
    marginRight: SPACING.md
  },
  challengeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text
  },
  challengeButton: {
    backgroundColor: COLORS.accent1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm
  },
  challengeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text
  }
});
