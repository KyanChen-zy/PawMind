import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface StatusCardProps { petName: string; emotion: string; summary: string; }

const EMOTION_MAP: Record<string, { icon: string; color: string; label: string; bgColor: string }> = {
  happy: { icon: '😊', color: COLORS.success, label: '超级开心', bgColor: COLORS.success + '15' },
  calm: { icon: '😌', color: COLORS.secondary, label: '很平静', bgColor: COLORS.secondary + '15' },
  anxious: { icon: '😟', color: COLORS.warning, label: '有点焦虑', bgColor: COLORS.warning + '15' },
  excited: { icon: '🤩', color: COLORS.primary, label: '超级兴奋', bgColor: COLORS.primary + '15' },
  sleepy: { icon: '😴', color: COLORS.textSecondary, label: '犯困中', bgColor: COLORS.textSecondary + '15' },
  playful: { icon: '😸', color: COLORS.accent1, label: '调皮捣蛋', bgColor: COLORS.accent1 + '15' },
};

export function StatusCard({ petName, emotion, summary }: StatusCardProps) {
  const info = EMOTION_MAP[emotion] || EMOTION_MAP.calm;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // 入场动画
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    // 呼吸动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.card, 
        {
          transform: [
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>你好呀！</Text>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.time}>今天 {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <Animated.View 
          style={[
            styles.iconContainer, 
            { backgroundColor: info.bgColor },
            {
              transform: [
                { scale: pulseAnim }
              ]
            }
          ]}
        >
          <Text style={styles.emotionIcon}>{info.icon}</Text>
        </Animated.View>
      </View>
      
      <View style={[styles.emotionBadge, { backgroundColor: info.color + '20' }]}>
        <Text style={[styles.emotionText, { color: info.color }]}>{info.label}</Text>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>今日状态</Text>
        <Text style={styles.summary}>{summary}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: COLORS.primary + '20' }]}>
              <Text style={styles.statIcon}>🍽️</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>饮食</Text>
              <Text style={styles.statValue}>正常</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: COLORS.secondary + '20' }]}>
              <Text style={styles.statIcon}>🏃</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>活动</Text>
              <Text style={styles.statValue}>充足</Text>
            </View>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: COLORS.accent1 + '20' }]}>
              <Text style={styles.statIcon}>💤</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>睡眠</Text>
              <Text style={styles.statValue}>良好</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: COLORS.accent2 + '20' }]}>
              <Text style={styles.statIcon}>❤️</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>心情</Text>
              <Text style={[styles.statValue, { color: info.color }]}>{info.label}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.actionButton}>
        <Text style={styles.actionButtonText}>查看详情</Text>
        <Text style={styles.actionButtonIcon}>→</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: COLORS.border
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs
  },
  petName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface
  },
  emotionIcon: {
    fontSize: 40
  },
  emotionBadge: {
    alignSelf: 'flex-start',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md
  },
  emotionText: {
    fontSize: 16,
    fontWeight: '700'
  },
  summaryContainer: {
    marginBottom: SPACING.lg
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.sm
  },
  summary: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontWeight: '500'
  },
  statsContainer: {
    marginBottom: SPACING.lg
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm
  },
  statIcon: {
    fontSize: 20
  },
  statInfo: {
    flex: 1
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2
  },
  statValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600'
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '30'
  },
  actionButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: SPACING.xs
  },
  actionButtonIcon: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600'
  }
});
