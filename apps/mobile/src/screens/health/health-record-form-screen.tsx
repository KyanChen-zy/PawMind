import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePetStore } from '../../stores/pet.store';
import * as healthService from '../../services/health';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const AVAILABLE_TAGS = ['发烧', '呕吐', '腹泻', '咳嗽', '食欲不振', '精神萎靡', '皮肤问题', '眼部问题'];

export function HealthRecordFormScreen() {
  const navigation = useNavigation<any>();
  const { currentPet } = usePetStore();

  const [recordType, setRecordType] = useState<'visit' | 'observation'>('visit');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [hospitalName, setHospitalName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [doctorAdvice, setDoctorAdvice] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeInput, setActiveInput] = useState<'keyboard' | 'ocr' | 'voice'>('keyboard');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!currentPet) return;
    if (recordType === 'visit' && !visitDate) {
      Alert.alert('提示', '请填写就诊日期');
      return;
    }
    if (recordType === 'observation' && !content.trim()) {
      Alert.alert('提示', '请填写观察内容');
      return;
    }
    setSaving(true);
    try {
      await healthService.createHealthRecord(currentPet.id, {
        recordType,
        visitDate: recordType === 'visit' ? visitDate : undefined,
        hospitalName: recordType === 'visit' ? hospitalName : undefined,
        diagnosis: recordType === 'visit' ? diagnosis : undefined,
        prescription: recordType === 'visit' ? prescription : undefined,
        doctorAdvice: recordType === 'visit' ? doctorAdvice : undefined,
        content: recordType === 'observation' ? content : undefined,
        tags: recordType === 'observation' ? selectedTags : undefined,
        inputMethod: activeInput,
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
        <Text style={styles.headerTitle}>添加健康档案</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Type selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>记录类型</Text>
          <View style={styles.chipRow}>
            {(['visit', 'observation'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, recordType === type && styles.typeChipActive]}
                onPress={() => setRecordType(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.typeChipText, recordType === type && styles.typeChipTextActive]}>
                  {type === 'visit' ? '就诊记录' : '日常观察'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {recordType === 'visit' ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>就诊信息</Text>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>就诊日期</Text>
              <TextInput
                style={styles.input}
                value={visitDate}
                onChangeText={setVisitDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>医院名称</Text>
              <TextInput
                style={styles.input}
                value={hospitalName}
                onChangeText={setHospitalName}
                placeholder="请输入医院名称"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>诊断结果</Text>
              <TextInput
                style={styles.input}
                value={diagnosis}
                onChangeText={setDiagnosis}
                placeholder="请输入诊断结果"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>处方用药</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={prescription}
                onChangeText={setPrescription}
                placeholder="请输入处方用药"
                placeholderTextColor={COLORS.textLight}
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>医嘱建议</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={doctorAdvice}
                onChangeText={setDoctorAdvice}
                placeholder="请输入医嘱建议"
                placeholderTextColor={COLORS.textLight}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>观察内容</Text>
            <TextInput
              style={[styles.input, styles.observationInput]}
              value={content}
              onChangeText={setContent}
              placeholder="记录今天观察到的情况..."
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>标签</Text>
            <View style={styles.tagGrid}>
              {AVAILABLE_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tagChipText, selectedTags.includes(tag) && styles.tagChipTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled, SHADOWS.sm]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>{saving ? '保存中...' : '保存'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom toolbar */}
      <View style={styles.toolbar}>
        {([
          { key: 'keyboard', label: '键盘' },
          { key: 'ocr', label: 'OCR' },
          { key: 'voice', label: '语音' },
        ] as const).map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.toolbarBtn, activeInput === key && styles.toolbarBtnActive]}
            onPress={() => {
              if (key === 'ocr') {
                Alert.alert('即将上线', 'OCR 功能即将上线');
              } else if (key === 'voice') {
                Alert.alert('即将上线', '语音输入即将上线');
              } else {
                setActiveInput('keyboard');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.toolbarBtnText, activeInput === key && styles.toolbarBtnTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  chipRow: { flexDirection: 'row', gap: SPACING.sm },
  typeChip: { flex: 1, borderRadius: BORDER_RADIUS.round, paddingVertical: SPACING.sm, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border },
  typeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeChipText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  typeChipTextActive: { color: '#FFF' },
  field: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  input: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: 15, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  multilineInput: { minHeight: 72, textAlignVertical: 'top' },
  observationInput: { minHeight: 120, textAlignVertical: 'top' },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  tagChip: { borderRadius: BORDER_RADIUS.round, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.background },
  tagChipActive: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  tagChipText: { fontSize: 13, color: COLORS.textSecondary },
  tagChipTextActive: { color: '#FFF' },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  toolbar: { flexDirection: 'row', backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, gap: SPACING.sm },
  toolbarBtn: { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  toolbarBtnActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  toolbarBtnText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  toolbarBtnTextActive: { color: COLORS.primary, fontWeight: '700' },
});
