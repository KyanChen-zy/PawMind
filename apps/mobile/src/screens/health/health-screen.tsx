import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import * as healthService from '../../services/health';
import type { HealthLogInfo } from '../../services/health';
import { COLORS, SPACING } from '../../constants/theme';

const SEVERITY_COLORS: Record<string, string> = { observe: COLORS.alertObserve, caution: COLORS.alertCaution, urgent: COLORS.alertUrgent };
const SEVERITY_LABELS: Record<string, string> = { observe: '观察', caution: '注意', urgent: '立即就医' };

export function HealthScreen() {
  const { currentPet } = usePetStore();
  const [logs, setLogs] = useState<HealthLogInfo[]>([]);
  const [alerts, setAlerts] = useState<HealthLogInfo[]>([]);
  const [weight, setWeight] = useState('');
  const [appetite, setAppetite] = useState('normal');
  const [activity, setActivity] = useState('normal');

  useEffect(() => { if (currentPet) loadData(); }, [currentPet?.id]);

  const loadData = async () => {
    if (!currentPet) return;
    try {
      const [logsData, alertsData] = await Promise.all([healthService.getHealthTrends(currentPet.id, 7), healthService.getAlerts(currentPet.id)]);
      setLogs(logsData); setAlerts(alertsData);
    } catch {}
  };

  const handleRecord = async () => {
    if (!currentPet) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await healthService.createHealthLog(currentPet.id, { date: today, weight: weight ? parseFloat(weight) : undefined, appetiteLevel: appetite, activityLevel: activity });
      Alert.alert('记录成功', '今日健康数据已保存');
      setWeight(''); loadData();
    } catch (e: any) { Alert.alert('记录失败', e.message); }
  };

  if (!currentPet) {
    return (<SafeAreaView style={styles.container}><View style={styles.empty}><Text style={{ fontSize: 40 }}>📊</Text><Text style={styles.emptyText}>还没有记录，今天就开始吧</Text></View></SafeAreaView>);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.pageTitle}>{currentPet.name} 的健康</Text>
        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>预警提醒</Text>
            {alerts.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, { borderLeftColor: SEVERITY_COLORS[alert.severity || 'observe'] }]}>
                <Text style={styles.alertType}>{alert.alertType}</Text>
                <Text style={[styles.alertSeverity, { color: SEVERITY_COLORS[alert.severity || 'observe'] }]}>{SEVERITY_LABELS[alert.severity || 'observe']}</Text>
                <Text style={styles.alertDate}>{alert.date}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日健康记录</Text>
          <View style={styles.inputRow}>
            <Text style={styles.label}>体重 (kg)</Text>
            <TextInput style={styles.numberInput} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder={String(currentPet.weight)} />
          </View>
          <Text style={styles.label}>食欲</Text>
          <View style={styles.chipRow}>
            {['low', 'normal', 'high'].map((level) => (
              <TouchableOpacity key={level} style={[styles.chip, appetite === level && styles.chipActive]} onPress={() => setAppetite(level)}>
                <Text style={appetite === level ? styles.chipTextActive : styles.chipText}>{level === 'low' ? '偏低' : level === 'normal' ? '正常' : '偏高'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>活动量</Text>
          <View style={styles.chipRow}>
            {['low', 'normal', 'high'].map((level) => (
              <TouchableOpacity key={level} style={[styles.chip, activity === level && styles.chipActive]} onPress={() => setActivity(level)}>
                <Text style={activity === level ? styles.chipTextActive : styles.chipText}>{level === 'low' ? '偏低' : level === 'normal' ? '正常' : '偏高'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.recordBtn} onPress={handleRecord}>
            <Text style={styles.recordBtnText}>保存记录</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>近 7 天趋势</Text>
          {logs.length === 0 ? <Text style={styles.emptyText}>暂无数据</Text> : logs.map((log) => (
            <View key={log.id} style={styles.logRow}>
              <Text style={styles.logDate}>{log.date}</Text>
              <Text style={styles.logValue}>{log.weight ? `${log.weight}kg` : '-'}</Text>
              <Text style={styles.logValue}>{log.appetiteLevel || '-'}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  pageTitle: { fontSize: 22, fontWeight: '700', padding: SPACING.md },
  section: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, marginHorizontal: SPACING.md, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: SPACING.md },
  alertCard: { borderLeftWidth: 4, backgroundColor: COLORS.background, borderRadius: 8, padding: SPACING.md, marginBottom: SPACING.sm },
  alertType: { fontSize: 15, fontWeight: '600' },
  alertSeverity: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  alertDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  label: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  numberInput: { backgroundColor: COLORS.background, borderRadius: 8, padding: SPACING.sm, width: 100, textAlign: 'center', fontSize: 16 },
  chipRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  chip: { borderRadius: 16, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary },
  chipTextActive: { color: '#FFF' },
  recordBtn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  recordBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  logDate: { fontSize: 14, color: COLORS.text },
  logValue: { fontSize: 14, color: COLORS.textSecondary },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, textAlign: 'center' },
});
