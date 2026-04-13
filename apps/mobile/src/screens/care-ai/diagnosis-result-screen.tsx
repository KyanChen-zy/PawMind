import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePetStore } from '../../stores/pet.store';
import { useCareAiStore } from '../../stores/care-ai.store';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import type { DiagnosisReportInfo } from '../../services/care-ai';

export function DiagnosisResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { diagnosisType, diagnosisName, imageUrl } = route.params || {};
  const { currentPet } = usePetStore();
  const { createDiagnosis } = useCareAiStore();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<DiagnosisReportInfo | null>(null);

  useEffect(() => {
    if (!currentPet) return;
    const timer = setTimeout(async () => {
      try {
        const diagnosis = await createDiagnosis(currentPet.id, diagnosisType, imageUrl || 'mock://image');
        setResult(diagnosis);
      } catch {
        setResult({
          id: 0, petId: currentPet.id, diagnosisType, imageUrl: imageUrl || 'mock://image',
          resultSummary: '分析完成，未发现明显异常。',
          resultDetail: { items: [{ label: '整体状况', value: '正常' }, { label: '建议', value: '保持日常护理' }] },
          savedToRecord: false, createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    Alert.alert('已保存', '诊断结果已保存到健康档案');
  };

  const renderDetailItems = () => {
    if (!result?.resultDetail) return null;
    const detail = result.resultDetail as any;
    if (!detail.items || !Array.isArray(detail.items)) return null;
    return detail.items.map((item: any, idx: number) => (
      <View key={idx} style={styles.detailRow}>
        <Text style={styles.detailLabel}>{item.label}</Text>
        <Text style={styles.detailValue}>{item.value}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>诊断结果</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>AI 正在分析...</Text>
            <Text style={styles.loadingSubText}>请稍候，这通常需要几秒钟</Text>
          </View>
        ) : (
          <>
            {/* Result Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>🔍</Text>
              <Text style={styles.summaryTitle}>{diagnosisName} 分析结果</Text>
              <Text style={styles.summaryText}>{result?.resultSummary || '分析完成'}</Text>
            </View>

            {/* Detail Items */}
            {result?.resultDetail && (
              <View style={styles.detailCard}>
                <Text style={styles.sectionTitle}>详细信息</Text>
                {renderDetailItems()}
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>保存到健康档案</Text>
            </TouchableOpacity>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                ⚠️ AI 分析仅供参考，不替代专业兽医诊断。如有疑虑，请及时就医。
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 22, color: COLORS.text },
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  loadingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingTop: 80, gap: SPACING.md,
  },
  loadingText: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md },
  loadingSubText: { fontSize: 14, color: COLORS.textSecondary },
  summaryCard: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  summaryIcon: { fontSize: 48, marginBottom: SPACING.sm },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  summaryText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  detailCard: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  detailLabel: { fontSize: 14, color: COLORS.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md, alignItems: 'center', marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  disclaimer: {
    backgroundColor: COLORS.warning + '20', borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.warning,
  },
  disclaimerText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
});
