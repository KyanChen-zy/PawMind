import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface StatusCardProps { petName: string; emotion: string; summary: string; }

const EMOTION_MAP: Record<string, { icon: string; color: string; label: string }> = {
  happy: { icon: '😊', color: COLORS.success, label: '开心' },
  calm: { icon: '😌', color: COLORS.secondary, label: '平静' },
  anxious: { icon: '😟', color: COLORS.warning, label: '焦虑' },
  excited: { icon: '🤩', color: COLORS.primary, label: '兴奋' },
  sleepy: { icon: '😴', color: COLORS.textSecondary, label: '犯困' },
  playful: { icon: '😸', color: COLORS.primary, label: '调皮' },
};

export function StatusCard({ petName, emotion, summary }: StatusCardProps) {
  const info = EMOTION_MAP[emotion] || EMOTION_MAP.calm;
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.petName}>{petName}</Text>
        <Text style={{ fontSize: 32 }}>{info.icon}</Text>
      </View>
      <View style={[styles.emotionBadge, { backgroundColor: info.color + '20' }]}>
        <Text style={[styles.emotionText, { color: info.color }]}>{info.label}</Text>
      </View>
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, marginHorizontal: SPACING.md, marginTop: SPACING.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petName: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  emotionBadge: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginTop: SPACING.sm },
  emotionText: { fontSize: 14, fontWeight: '600' },
  summary: { fontSize: 15, color: COLORS.textSecondary, marginTop: SPACING.md, lineHeight: 22 },
});
