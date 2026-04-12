import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import * as growthService from '../../services/growth';
import type { GrowthRecordInfo } from '../../services/growth';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';

export function GrowthScreen() {
  const { currentPet } = usePetStore();
  const [records, setRecords] = useState<GrowthRecordInfo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => { if (currentPet) loadRecords(); }, [currentPet?.id]);

  const loadRecords = async () => { if (!currentPet) return; try { setRecords(await growthService.getGrowthRecords(currentPet.id)); } catch {} };

  const handleAdd = async () => {
    if (!currentPet || !description.trim()) return;
    try { await growthService.createGrowthRecord(currentPet.id, { contentType: 'text', description: description.trim() }); setDescription(''); setShowModal(false); loadRecords(); } catch (e: any) { Alert.alert('添加失败', e.message); }
  };

  const formatDate = (dateStr: string) => { const d = new Date(dateStr); return `${d.getMonth() + 1}月${d.getDate()}日`; };

  if (!currentPet) {
    return (<SafeAreaView style={styles.container}><View style={styles.empty}><Text style={{ fontSize: 40 }}>📸</Text><Text style={styles.emptyText}>快去记录第一个精彩瞬间</Text></View></SafeAreaView>);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentPet.name} 的成长册</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ 记录</Text>
        </TouchableOpacity>
      </View>
      <FlatList 
        data={records} 
        keyExtractor={(item) => String(item.id)} 
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
            {item.description && <Text style={styles.cardDesc}>{item.description}</Text>}
            {item.tags?.length > 0 && (
              <View style={styles.tagRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyText}>还没有成长记录</Text>
            <Text style={styles.emptySubText}>点击右上角开始记录精彩瞬间</Text>
          </View>
        }
      />
      <Modal 
        visible={showModal} 
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>新增记录</Text>
            <TouchableOpacity 
              onPress={handleAdd}
              activeOpacity={0.7}
              disabled={!description.trim()}
            >
              <Text style={[styles.saveText, !description.trim() && styles.saveTextDisabled]}>保存</Text>
            </TouchableOpacity>
          </View>
          <TextInput 
            style={styles.textArea} 
            value={description} 
            onChangeText={setDescription} 
            placeholder="记录今天的精彩瞬间..."
            placeholderTextColor={COLORS.textLight}
            multiline 
            numberOfLines={6}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  title: { fontSize: 22, fontWeight: '700' },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: 16, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  addBtnText: { color: '#FFF', fontWeight: '600' },
  list: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.sm },
  cardDate: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  cardDesc: { fontSize: 15, lineHeight: 22, color: COLORS.text },
  tagRow: { flexDirection: 'row', gap: SPACING.xs, marginTop: SPACING.sm, flexWrap: 'wrap' },
  tag: { backgroundColor: COLORS.primary + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyList: { paddingTop: 60, alignItems: 'center', paddingHorizontal: SPACING.md },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { color: COLORS.textSecondary, fontSize: 16, marginBottom: SPACING.sm },
  emptySubText: { color: COLORS.textLight, fontSize: 14, textAlign: 'center' },
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  cancelText: { color: COLORS.textSecondary, fontSize: 16 },
  saveText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  saveTextDisabled: { opacity: 0.5 },
  textArea: { margin: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, fontSize: 16, minHeight: 200, textAlignVertical: 'top' },
  charCount: { position: 'absolute', bottom: SPACING.md, right: SPACING.md, fontSize: 12, color: COLORS.textLight },
});
