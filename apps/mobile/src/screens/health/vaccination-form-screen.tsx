import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePetStore } from '../../stores/pet.store';
import * as vaccinationService from '../../services/vaccination';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

export function VaccinationFormScreen() {
  const navigation = useNavigation<any>();
  const { currentPet } = usePetStore();

  const [vaccineName, setVaccineName] = useState('');
  const [vaccinationDate, setVaccinationDate] = useState(new Date().toISOString().split('T')[0]);
  const [institution, setInstitution] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!currentPet) return;
    if (!vaccineName.trim()) {
      Alert.alert('提示', '请填写疫苗名称');
      return;
    }
    if (!vaccinationDate.trim()) {
      Alert.alert('提示', '请填写接种日期');
      return;
    }
    setSaving(true);
    try {
      await vaccinationService.createVaccination(currentPet.id, {
        vaccineName: vaccineName.trim(),
        vaccinationDate,
        institution: institution.trim() || undefined,
        batchNumber: batchNumber.trim() || undefined,
        expiryDate: expiryDate.trim() || undefined,
        nextDueDate: nextDueDate.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('保存失败', e.message ?? '请稍后重试');
    }
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>添加疫苗记录</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Barcode scan button */}
        <TouchableOpacity
          style={[styles.scanBtn, SHADOWS.sm]}
          onPress={() => Alert.alert('即将上线', '条形码扫描即将上线')}
          activeOpacity={0.8}
        >
          <Text style={styles.scanIcon}>▦</Text>
          <Text style={styles.scanText}>扫描条形码自动填写</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>疫苗名称 *</Text>
            <TextInput
              style={styles.input}
              value={vaccineName}
              onChangeText={setVaccineName}
              placeholder="请输入疫苗名称"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>接种日期 *</Text>
            <TextInput
              style={styles.input}
              value={vaccinationDate}
              onChangeText={setVaccinationDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>接种机构</Text>
            <TextInput
              style={styles.input}
              value={institution}
              onChangeText={setInstitution}
              placeholder="请输入接种机构"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>批次号</Text>
            <TextInput
              style={styles.input}
              value={batchNumber}
              onChangeText={setBatchNumber}
              placeholder="请输入批次号"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>有效期至</Text>
            <TextInput
              style={styles.input}
              value={expiryDate}
              onChangeText={setExpiryDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>下次接种日期</Text>
            <TextInput
              style={styles.input}
              value={nextDueDate}
              onChangeText={setNextDueDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>备注</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="其他备注信息"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled, SHADOWS.sm]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>{saving ? '保存中...' : '保存'}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xl },
  scanBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1.5, borderColor: COLORS.secondary, borderStyle: 'dashed', gap: SPACING.sm },
  scanIcon: { fontSize: 20, color: COLORS.secondary },
  scanText: { fontSize: 15, color: COLORS.secondary, fontWeight: '600' },
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  field: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  input: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: 15, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  multilineInput: { minHeight: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
