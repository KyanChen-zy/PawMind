import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import * as careAiService from '../../services/care-ai';
import type { DailyTipInfo } from '../../services/care-ai';

export function DailyTipScreen() {
  const navigation = useNavigation<any>();
  const [todayTip, setTodayTip] = useState<DailyTipInfo | null>(null);
  const [historyTips, setHistoryTips] = useState<DailyTipInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    setLoading(true);
    try {
      const [tip, all] = await Promise.all([
        careAiService.getDailyTip(),
        careAiService.getDailyTips(),
      ]);
      setTodayTip(tip);
      const history = tip ? all.filter(t => t.id !== tip.id) : all;
      setHistoryTips(history);
    } catch {}
    setLoading(false);
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return dateStr.slice(0, 10);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>每日小知识</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.xxl }} />
        ) : (
          <>
            {/* Today's Tip */}
            {todayTip ? (
              <View style={styles.todayCard}>
                <View style={styles.todayCardHeader}>
                  <Text style={styles.todayLabel}>今日知识</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{todayTip.category}</Text>
                  </View>
                </View>
                <Text style={styles.todayTitle}>{todayTip.title}</Text>
                <Text style={styles.todayContent}>{todayTip.content}</Text>
                {todayTip.publishDate && (
                  <Text style={styles.dateText}>{formatDate(todayTip.publishDate)}</Text>
                )}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>暂无今日知识 🐾</Text>
              </View>
            )}

            {/* History Tips */}
            {historyTips.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>历史知识</Text>
                {historyTips.map(tip => {
                  const expanded = expandedIds.has(tip.id);
                  return (
                    <TouchableOpacity
                      key={tip.id}
                      style={styles.historyItem}
                      onPress={() => toggleExpand(tip.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.historyItemHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.historyTitle}>{tip.title}</Text>
                          {tip.summary && (
                            <Text style={styles.historySummary} numberOfLines={expanded ? undefined : 2}>
                              {expanded ? tip.content : tip.summary}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
                      </View>
                      <View style={styles.historyFooter}>
                        <View style={[styles.categoryBadge, styles.categoryBadgeSm]}>
                          <Text style={styles.categoryTextSm}>{tip.category}</Text>
                        </View>
                        {tip.publishDate && (
                          <Text style={styles.historyDate}>{formatDate(tip.publishDate)}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
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
  backText: { fontSize: 28, color: COLORS.primary, lineHeight: 32 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  todayCard: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.md,
    borderLeftWidth: 4, borderLeftColor: COLORS.primary,
  },
  todayCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  todayLabel: { fontSize: 12, color: COLORS.primary, fontWeight: '700', marginRight: SPACING.sm },
  categoryBadge: {
    backgroundColor: COLORS.primary + '20', borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm, paddingVertical: 2,
  },
  categoryText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  todayTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  todayContent: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  dateText: { fontSize: 12, color: COLORS.textLight, marginTop: SPACING.sm },
  emptyCard: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl, alignItems: 'center', ...SHADOWS.sm,
  },
  emptyText: { fontSize: 16, color: COLORS.textLight },
  section: { marginTop: SPACING.sm },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  historyItem: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm,
  },
  historyItemHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  historyTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  historySummary: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  expandIcon: { fontSize: 12, color: COLORS.textLight, marginLeft: SPACING.sm, marginTop: 4 },
  historyFooter: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm },
  categoryBadgeSm: { paddingHorizontal: SPACING.xs, paddingVertical: 1 },
  categoryTextSm: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  historyDate: { fontSize: 11, color: COLORS.textLight, marginLeft: SPACING.sm },
});
