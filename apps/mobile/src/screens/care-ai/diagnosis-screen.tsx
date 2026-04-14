import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const GUIDANCE: Record<string, { icon: string; text: string }> = {
  oral: { icon: '🦷', text: '请拍摄宠物口腔内部的清晰照片' },
  stool: { icon: '💩', text: '请拍摄粪便全貌的清晰照片' },
  skin: { icon: '🩹', text: '请拍摄皮肤患处的清晰照片' },
  report: { icon: '📋', text: '请拍摄检验报告的清晰照片' },
  medicine: { icon: '💊', text: '请拍摄药品包装或说明书' },
};

export function DiagnosisScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { diagnosisType, diagnosisName } = route.params || {};

  const guidance = GUIDANCE[diagnosisType] || { icon: '📷', text: '请拍摄清晰照片' };

  const handleCapture = () => {
    Alert.alert('提示', '相机功能即将上线，使用模拟数据演示', [
      { text: '确定', onPress: () => navigation.navigate('DiagnosisResult', { diagnosisType, diagnosisName, imageUrl: 'mock://image' }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{diagnosisName || 'AI 诊断'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Guidance */}
      <View style={styles.guidanceArea}>
        <Text style={styles.guidanceIcon}>{guidance.icon}</Text>
        <Text style={styles.guidanceText}>{guidance.text}</Text>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderIcon}>📷</Text>
          <Text style={styles.photoPlaceholderText}>拍照区域</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonArea}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleCapture} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>📷 拍照</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleCapture} activeOpacity={0.8}>
          <Text style={styles.secondaryBtnText}>🖼 从相册选择</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 20, color: COLORS.text },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: COLORS.text },
  guidanceArea: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  guidanceIcon: { fontSize: 64, marginBottom: SPACING.md },
  guidanceText: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  photoPlaceholder: { width: '100%', aspectRatio: 1, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.lg, justifyContent: 'center', alignItems: 'center', ...SHADOWS.sm },
  photoPlaceholderIcon: { fontSize: 48, marginBottom: SPACING.sm },
  photoPlaceholderText: { fontSize: 16, color: COLORS.textLight },
  buttonArea: { padding: SPACING.lg, gap: SPACING.sm },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', ...SHADOWS.sm },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  secondaryBtn: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  secondaryBtnText: { fontSize: 16, fontWeight: '500', color: COLORS.text },
});
