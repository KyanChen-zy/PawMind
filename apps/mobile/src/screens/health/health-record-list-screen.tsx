import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { usePetStore } from '../../stores/pet.store';
import * as healthService from '../../services/health';
import type { HealthRecordInfo } from '../../services/health';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const RECORD_TYPE_LABELS: Record<string, string> = {
  visit: '就诊记录',
  observation: '日常观察',
};
const RECORD_TYPE_COLORS: Record<string, string> = {
  visit: COLORS.primary,
  observation: COLORS.secondary,
};

function RecordCard({ record }: { record: HealthRecordInfo }) {
  const typeColor = RECORD_TYPE_COLORS[record.recordType] ?? COLORS.textLight;
  const typeLabel = RECORD_TYPE_LABELS[record.recordType] ?? record.recordType;
  const date = record.visitDate ?? record.createdAt.split('T')[0];
  const summary =
    record.recordType === 'visit'
      ? [record.hospitalName, record.diagnosis].filter(Boolean).join(' · ')
      : record.content?.slice(0, 60) ?? '';

  return (
    <View style={[styles.card, SHADOWS.sm]}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: typeColor + '20' }]}>
          <Text style={[styles.badgeText, { color: typeColor }]}>{typeLabel}</Text>
        </View>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      {!!summary && <Text style={styles.summaryText} numberOfLines={2}>{summary}</Text>}
      {record.tags && record.tags.length > 0 && (
        <View style={styles.tagRow}>
          {record.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function HealthRecordListScreen() {
  const navigation = useNavigation<any>();
  const { currentPet } = usePetStore();
  const [records, setRecords] = useState<HealthRecordInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecords = useCallback(async () => {
    if (!currentPet) return;
    setLoading(true);
    try {
      const data = await healthService.getHealthRecords(currentPet.id);
      setRecords(data);
    } catch {}
    setLoading(false);
  }, [currentPet?.id]);

  useFocusEffect(useCallback(() => { loadRecords(); }, [loadRecords]));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>健康档案</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <RecordCard record={item} />}
          contentContainerStyle={records.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>还没有健康档案，点击 + 开始记录</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, SHADOWS.md]}
        onPress={() => navigation.navigate('HealthRecordForm')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: SPACING.xs },
  backIcon: { fontSize: 28, color: COLORS.text, lineHeight: 32 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: COLORS.text },
  headerRight: { width: 36 },
  loader: { flex: 1 },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingTop: SPACING.xxxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center' },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  badge: { borderRadius: BORDER_RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  dateText: { fontSize: 13, color: COLORS.textSecondary },
  summaryText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.sm },
  tag: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  tagText: { fontSize: 12, color: COLORS.textSecondary },
  fab: { position: 'absolute', bottom: SPACING.xl, right: SPACING.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  fabIcon: { fontSize: 28, color: '#FFF', lineHeight: 32 },
});
