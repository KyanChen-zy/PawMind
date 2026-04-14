import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { usePetStore } from '../../stores/pet.store';
import * as vaccinationService from '../../services/vaccination';
import type { VaccinationInfo } from '../../services/vaccination';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

function UpcomingCard({ item }: { item: VaccinationInfo }) {
  return (
    <View style={[styles.upcomingCard, SHADOWS.sm]}>
      <View style={styles.upcomingLeft}>
        <Text style={styles.upcomingName}>{item.vaccineName}</Text>
        {item.institution && <Text style={styles.upcomingInstitution}>{item.institution}</Text>}
      </View>
      <View style={styles.upcomingRight}>
        <Text style={styles.upcomingLabel}>到期日</Text>
        <Text style={styles.upcomingDate}>{item.nextDueDate}</Text>
      </View>
    </View>
  );
}

function VaccinationCard({ item }: { item: VaccinationInfo }) {
  return (
    <View style={[styles.card, SHADOWS.sm]}>
      <View style={styles.cardRow}>
        <Text style={styles.vaccineName}>{item.vaccineName}</Text>
        <Text style={styles.vaccineDate}>{item.vaccinationDate}</Text>
      </View>
      {item.institution && (
        <Text style={styles.vaccineDetail}>接种机构：{item.institution}</Text>
      )}
      {item.nextDueDate && (
        <Text style={styles.vaccineDetail}>下次接种：{item.nextDueDate}</Text>
      )}
    </View>
  );
}

export function VaccinationListScreen() {
  const navigation = useNavigation<any>();
  const { currentPet } = usePetStore();
  const [vaccinations, setVaccinations] = useState<VaccinationInfo[]>([]);
  const [upcoming, setUpcoming] = useState<VaccinationInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!currentPet) return;
    setLoading(true);
    try {
      const [all, soon] = await Promise.all([
        vaccinationService.getVaccinations(currentPet.id),
        vaccinationService.getUpcoming(currentPet.id),
      ]);
      setVaccinations(all);
      setUpcoming(soon);
    } catch {}
    setLoading(false);
  }, [currentPet?.id]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const ListHeader = upcoming.length > 0 ? (
    <View style={styles.upcomingSection}>
      <Text style={styles.sectionTitle}>即将到期</Text>
      {upcoming.map((item) => <UpcomingCard key={item.id} item={item} />)}
      <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>接种记录</Text>
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>疫苗本</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} />
      ) : (
        <FlatList
          data={vaccinations}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <VaccinationCard item={item} />}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={vaccinations.length === 0 && upcoming.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            upcoming.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💉</Text>
                <Text style={styles.emptyText}>还没有疫苗记录</Text>
              </View>
            ) : null
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, SHADOWS.md]}
        onPress={() => navigation.navigate('VaccinationForm')}
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
  emptyText: { color: COLORS.textSecondary, fontSize: 15 },
  upcomingSection: { marginBottom: SPACING.sm },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  upcomingCard: { backgroundColor: COLORS.warning + '22', borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: COLORS.warning },
  upcomingLeft: { flex: 1 },
  upcomingName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  upcomingInstitution: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  upcomingRight: { alignItems: 'flex-end' },
  upcomingLabel: { fontSize: 11, color: COLORS.textLight },
  upcomingDate: { fontSize: 14, fontWeight: '600', color: COLORS.warning },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  vaccineName: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  vaccineDate: { fontSize: 13, color: COLORS.textSecondary },
  vaccineDetail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  fab: { position: 'absolute', bottom: SPACING.xl, right: SPACING.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  fabIcon: { fontSize: 28, color: '#FFF', lineHeight: 32 },
});
