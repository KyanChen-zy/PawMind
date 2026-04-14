import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePetStore } from '../../stores/pet.store';
import * as healthService from '../../services/health';
import type { HealthMetricInfo } from '../../services/health';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const BAR_MAX_HEIGHT = 120;
const MANUAL_METRICS = new Set(['weight', 'food', 'water', 'temperature', 'stool']);

const METRIC_UNITS: Record<string, string> = {
  water: 'ml', food: 'g', exercise: 'min', sleep: 'h',
  temperature: '°C', heart_rate: 'bpm', stool: '次', weight: 'kg',
};

export function HealthMetricDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { metricType, metricName } = route.params as { metricType: string; metricName: string };
  const { currentPet } = usePetStore();

  const [range, setRange] = useState<'24h' | '7d'>('24h');
  const [metrics, setMetrics] = useState<HealthMetricInfo[]>([]);
  const [entryModalVisible, setEntryModalVisible] = useState(false);
  const [valueInput, setValueInput] = useState('');

  useEffect(() => { if (currentPet) loadMetrics(); }, [currentPet?.id, range]);

  const loadMetrics = async () => {
    if (!currentPet) return;
    try {
      const data = await healthService.getMetrics(currentPet.id, metricType, range);
      setMetrics(data);
    } catch {}
  };

  const handleRecord = async () => {
    if (!currentPet || !valueInput) return;
    try {
      await healthService.recordMetric({
        petId: currentPet.id,
        metricType,
        value: parseFloat(valueInput),
        unit: METRIC_UNITS[metricType] || '',
        source: 'manual',
        recordedAt: new Date().toISOString(),
      });
      Alert.alert('记录成功', `${metricName}已保存`);
      setEntryModalVisible(false);
      setValueInput('');
      loadMetrics();
    } catch (e: any) {
      Alert.alert('记录失败', e.message);
    }
  };

  const maxValue = metrics.length > 0 ? Math.max(...metrics.map(m => m.value), 1) : 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{metricName}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Time Range Toggle */}
        <View style={styles.rangeRow}>
          {(['24h', '7d'] as const).map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
              onPress={() => setRange(r)}
              activeOpacity={0.8}
            >
              <Text style={[styles.rangeBtnText, range === r && styles.rangeBtnTextActive]}>
                {r === '24h' ? '24h' : '7天'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar Chart */}
        <View style={styles.chartSection}>
          {metrics.length === 0 ? (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyText}>暂无数据</Text>
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <View style={styles.barsRow}>
                {metrics.map((m, i) => {
                  const barHeight = Math.max(4, (m.value / maxValue) * BAR_MAX_HEIGHT);
                  const label = range === '24h'
                    ? new Date(m.recordedAt).getHours() + 'h'
                    : new Date(m.recordedAt).toLocaleDateString('zh', { month: 'numeric', day: 'numeric' });
                  return (
                    <View key={m.id} style={styles.barWrapper}>
                      <Text style={styles.barValueLabel}>{m.value}</Text>
                      <View style={[styles.bar, { height: barHeight }]} />
                      <Text style={styles.barTimeLabel}>{label}</Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.chartUnit}>单位: {METRIC_UNITS[metricType] || ''}</Text>
            </View>
          )}
        </View>

        {/* Manual Entry Button */}
        {MANUAL_METRICS.has(metricType) && (
          <TouchableOpacity style={styles.entryBtn} onPress={() => setEntryModalVisible(true)} activeOpacity={0.8}>
            <Text style={styles.entryBtnText}>手动录入{metricName}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Entry Modal */}
      <Modal visible={entryModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>录入{metricName}</Text>
            <TextInput
              style={styles.modalInput}
              value={valueInput}
              onChangeText={setValueInput}
              keyboardType="decimal-pad"
              placeholder={`输入${metricName} (${METRIC_UNITS[metricType] || ''})`}
              placeholderTextColor={COLORS.textLight}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setEntryModalVisible(false)}>
                <Text style={styles.modalCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleRecord}>
                <Text style={styles.modalConfirmText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface, ...SHADOWS.sm,
  },
  backBtn: { width: 40, alignItems: 'center' },
  backArrow: { fontSize: 28, color: COLORS.text, lineHeight: 32 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xl },
  rangeRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
    padding: 4, marginBottom: SPACING.md, alignSelf: 'center',
  },
  rangeBtn: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  rangeBtnActive: { backgroundColor: COLORS.primary },
  rangeBtnText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  rangeBtnTextActive: { color: '#FFF' },
  chartSection: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.sm,
    minHeight: 180,
  },
  emptyChart: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xl },
  emptyText: { color: COLORS.textLight, fontSize: 14 },
  chartContainer: {},
  barsRow: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around',
    height: BAR_MAX_HEIGHT + 40, paddingTop: SPACING.md,
  },
  barWrapper: { alignItems: 'center', flex: 1 },
  barValueLabel: { fontSize: 10, color: COLORS.textSecondary, marginBottom: 4 },
  bar: { width: 16, backgroundColor: COLORS.primary, borderRadius: 4 },
  barTimeLabel: { fontSize: 10, color: COLORS.textLight, marginTop: 4 },
  chartUnit: { fontSize: 11, color: COLORS.textLight, textAlign: 'right', marginTop: SPACING.sm },
  entryBtn: {
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, alignItems: 'center',
  },
  entryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, width: 280,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  modalInput: {
    backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm, fontSize: 16, color: COLORS.text, marginBottom: SPACING.md,
  },
  modalBtns: { flexDirection: 'row', gap: SPACING.sm },
  modalCancelBtn: {
    flex: 1, borderRadius: BORDER_RADIUS.sm, paddingVertical: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
  },
  modalCancelText: { color: COLORS.textSecondary, fontSize: 15 },
  modalConfirmBtn: {
    flex: 1, borderRadius: BORDER_RADIUS.sm, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary, alignItems: 'center',
  },
  modalConfirmText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});
