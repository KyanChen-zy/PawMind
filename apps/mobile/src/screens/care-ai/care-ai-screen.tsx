import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCareAiStore } from '../../stores/care-ai.store';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const DIAGNOSIS_TYPES = [
  { type: 'oral', name: '口腔检查', icon: '🦷' },
  { type: 'stool', name: '粪便检查', icon: '💩' },
  { type: 'skin', name: '皮肤检查', icon: '🩹' },
  { type: 'report', name: '报告解读', icon: '📋' },
  { type: 'medicine', name: '药品识别', icon: '💊' },
];

export function CareAiScreen() {
  const navigation = useNavigation<any>();
  const { dailyTip, fetchDailyTip } = useCareAiStore();

  useEffect(() => { fetchDailyTip(); }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>CareAI</Text>

        {/* Daily Tip Card */}
        <TouchableOpacity
          style={styles.tipCard}
          onPress={() => navigation.navigate('DailyTip')}
          activeOpacity={0.8}
        >
          <View style={styles.tipBadge}>
            <Text style={styles.tipBadgeText}>每日小知识</Text>
          </View>
          <Text style={styles.tipTitle}>
            {dailyTip ? dailyTip.title : '加载中...'}
          </Text>
          {dailyTip?.summary ? (
            <Text style={styles.tipSummary} numberOfLines={2}>{dailyTip.summary}</Text>
          ) : null}
          <Text style={styles.tipMore}>查看详情 →</Text>
        </TouchableOpacity>

        {/* AI Diagnosis Grid */}
        <Text style={styles.sectionTitle}>AI 智能诊断</Text>
        <View style={styles.diagnosisGrid}>
          {DIAGNOSIS_TYPES.map((item, index) => {
            const isLast = index === DIAGNOSIS_TYPES.length - 1;
            const isOdd = DIAGNOSIS_TYPES.length % 2 !== 0;
            return (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.diagnosisBtn,
                  isLast && isOdd && styles.diagnosisBtnFull,
                ]}
                onPress={() => navigation.navigate('Diagnosis', {
                  diagnosisType: item.type,
                  diagnosisName: item.name,
                })}
                activeOpacity={0.8}
              >
                <Text style={styles.diagnosisIcon}>{item.icon}</Text>
                <Text style={styles.diagnosisName}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating QA Button */}
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => navigation.navigate('HealthQA')}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingBtnIcon}>💬</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.md, paddingBottom: 100 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.lg },
  tipCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  tipBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  tipBadgeText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  tipTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: SPACING.xs },
  tipSummary: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: SPACING.sm },
  tipMore: { fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'right' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  diagnosisGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  diagnosisBtn: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  diagnosisBtnFull: { width: '100%' },
  diagnosisIcon: { fontSize: 32, marginBottom: SPACING.sm },
  diagnosisName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  floatingBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  floatingBtnIcon: { fontSize: 24 },
});
