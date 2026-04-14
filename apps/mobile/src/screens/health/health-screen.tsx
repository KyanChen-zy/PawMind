import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePetStore } from '../../stores/pet.store';
import * as healthService from '../../services/health';
import * as deviceService from '../../services/device';
import type { HealthLogInfo, HealthMetricInfo } from '../../services/health';
import type { DeviceInfo } from '../../services/device';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const METRIC_NAMES: Record<string, string> = {
  water: '饮水量', food: '饮食量', exercise: '运动量', sleep: '睡眠',
  temperature: '体温', heart_rate: '心率', stool: '排便', weight: '体重',
};

const METRIC_UNITS: Record<string, string> = {
  water: 'ml', food: 'g', exercise: 'min', sleep: 'h',
  temperature: '°C', heart_rate: 'bpm', stool: '次', weight: 'kg',
};

const DEVICE_METRIC_MAP: Record<string, string[]> = {
  feeder: ['food'],
  fountain: ['water'],
  collar: ['exercise', 'sleep', 'temperature', 'heart_rate'],
  litter_box: ['stool'],
};

const SEVERITY_COLORS: Record<string, string> = {
  observe: COLORS.alertObserve, caution: COLORS.alertCaution, urgent: COLORS.alertUrgent,
};
const SEVERITY_LABELS: Record<string, string> = {
  observe: '观察', caution: '注意', urgent: '立即就医',
};

export function HealthScreen() {
  const navigation = useNavigation<any>();
  const { currentPet } = usePetStore();
  const [alerts, setAlerts] = useState<HealthLogInfo[]>([]);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [metrics, setMetrics] = useState<Record<string, HealthMetricInfo>>({});
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  useEffect(() => { if (currentPet) loadData(); }, [currentPet?.id]);

  const loadData = async () => {
    if (!currentPet) return;
    try {
      const [alertsData, devicesData, metricsData] = await Promise.all([
        healthService.getAlerts(currentPet.id),
        deviceService.getDevices(),
        healthService.getMetrics(currentPet.id, undefined, '24h'),
      ]);
      setAlerts(alertsData);
      setDevices(devicesData.filter(d => d.petId === currentPet.id));
      const latestByType: Record<string, HealthMetricInfo> = {};
      for (const m of metricsData) {
        if (!latestByType[m.metricType] || m.recordedAt > latestByType[m.metricType].recordedAt) {
          latestByType[m.metricType] = m;
        }
      }
      setMetrics(latestByType);
    } catch {}
  };

  const getActiveMetrics = (): string[] => {
    const active = new Set<string>(['weight']);
    for (const device of devices) {
      const mapped = DEVICE_METRIC_MAP[device.deviceType] || [];
      mapped.forEach(m => active.add(m));
    }
    return Array.from(active);
  };

  const allMetrics = Object.keys(METRIC_NAMES);
  const activeMetrics = getActiveMetrics();

  const getTrend = (metricType: string): string => {
    const m = metrics[metricType];
    if (!m) return '-';
    return '-';
  };

  const handleRecordWeight = async () => {
    if (!currentPet || !weightInput) return;
    try {
      await healthService.recordMetric({
        petId: currentPet.id,
        metricType: 'weight',
        value: parseFloat(weightInput),
        unit: 'kg',
        source: 'manual',
        recordedAt: new Date().toISOString(),
      });
      Alert.alert('记录成功', '体重已保存');
      setWeightModalVisible(false);
      setWeightInput('');
      loadData();
    } catch (e: any) {
      Alert.alert('记录失败', e.message);
    }
  };

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyText}>请先选择宠物</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>{currentPet.name} 的健康</Text>

        {/* Health Indicator Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll} contentContainerStyle={styles.cardsContent}>
          {allMetrics.map(metricType => {
            const isActive = activeMetrics.includes(metricType);
            const metricData = metrics[metricType];
            const name = METRIC_NAMES[metricType];
            const unit = METRIC_UNITS[metricType];
            if (isActive) {
              return (
                <TouchableOpacity
                  key={metricType}
                  style={styles.metricCard}
                  onPress={() => navigation.navigate('HealthMetricDetail', { metricType, metricName: name })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.metricName}>{name}</Text>
                  <Text style={styles.metricValue}>
                    {metricData ? `${metricData.value}` : '--'}
                  </Text>
                  <Text style={styles.metricUnit}>{unit}</Text>
                  <Text style={styles.metricTrend}>{getTrend(metricType)}</Text>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  key={metricType}
                  style={[styles.metricCard, styles.metricCardLocked]}
                  onPress={() => navigation.navigate('DeviceShop')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.metricNameLocked}>{name}</Text>
                  <Text style={styles.lockedText}>快来解锁{name}监测</Text>
                              <Text style={styles.lockIcon}>{'🔒'}</Text>
                </TouchableOpacity>
              );
            }
          })}
        </ScrollView>

        {/* Quick Entry Buttons */}
        <View style={styles.quickEntryRow}>
          {[
            { label: '健康档案', onPress: () => navigation.navigate('HealthRecordList') },
            { label: '疫苗本', onPress: () => navigation.navigate('VaccinationList') },
            { label: '设备管理', onPress: () => navigation.navigate('DeviceList') },
            { label: '手动录入', onPress: () => setWeightModalVisible(true) },
          ].map(btn => (
            <TouchableOpacity key={btn.label} style={styles.quickBtn} onPress={btn.onPress} activeOpacity={0.8}>
              <Text style={styles.quickBtnText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>预警提醒</Text>
            {alerts.map(alert => (
              <View key={alert.id} style={[styles.alertCard, { borderLeftColor: SEVERITY_COLORS[alert.severity || 'observe'] }]}>
                <Text style={styles.alertType}>{alert.alertType}</Text>
                <Text style={[styles.alertSeverity, { color: SEVERITY_COLORS[alert.severity || 'observe'] }]}>
                  {SEVERITY_LABELS[alert.severity || 'observe']}
                </Text>
                <Text style={styles.alertDate}>{alert.date}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Weight Entry Modal */}
      <Modal visible={weightModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>手动录入体重</Text>
            <TextInput
              style={styles.modalInput}
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="decimal-pad"
              placeholder="输入体重 (kg)"
              placeholderTextColor={COLORS.textLight}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setWeightModalVisible(false)}>
                <Text style={styles.modalCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleRecordWeight}>
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
  scrollContent: { paddingBottom: SPACING.xl },
  pageTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text, padding: SPACING.md },
  cardsScroll: { marginBottom: SPACING.md },
  cardsContent: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  metricCard: {
    width: 110, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md, alignItems: 'center', ...SHADOWS.sm,
  },
  metricCardLocked: { backgroundColor: '#F0F0F0' },
  metricName: { fontSize: 12, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  metricNameLocked: { fontSize: 12, color: COLORS.textLight, marginBottom: SPACING.xs },
  metricValue: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  metricUnit: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  metricTrend: { fontSize: 16, marginTop: SPACING.xs },
  lockedText: { fontSize: 11, color: COLORS.textLight, textAlign: 'center', marginTop: SPACING.xs },
  lockIcon: { fontSize: 18, marginTop: SPACING.xs },
  quickEntryRow: {
    flexDirection: 'row', marginHorizontal: SPACING.md, marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  quickBtn: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm, alignItems: 'center', ...SHADOWS.sm,
  },
  quickBtnText: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  section: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md, marginHorizontal: SPACING.md, marginBottom: SPACING.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: SPACING.md, color: COLORS.text },
  alertCard: {
    borderLeftWidth: 4, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md, marginBottom: SPACING.sm,
  },
  alertType: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  alertSeverity: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  alertDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  emptyCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
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
