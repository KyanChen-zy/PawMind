import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDeviceStore } from '../../stores/device.store';
import { usePetStore } from '../../stores/pet.store';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const DEVICE_TYPES = [
  { type: 'feeder', label: '智能喂食器', icon: '🍽' },
  { type: 'fountain', label: '智能饮水机', icon: '💧' },
  { type: 'collar', label: '智能项圈', icon: '📿' },
  { type: 'litter_box', label: '智能猫砂盆', icon: '🐱' },
];

export function DeviceBindFlowScreen() {
  const navigation = useNavigation<any>();
  const { bindDevice } = useDeviceStore();
  const { currentPet } = usePetStore();

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [pairingDone, setPairingDone] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [binding, setBinding] = useState(false);

  useEffect(() => {
    if (step === 2) {
      setPairingDone(false);
      const timer = setTimeout(() => setPairingDone(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleConfirm = async () => {
    if (!currentPet) return;
    setBinding(true);
    try {
      await bindDevice({ petId: currentPet.id, name: deviceName.trim() || selectedType, deviceType: selectedType });
      navigation.goBack();
    } finally {
      setBinding(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (step > 1 ? setStep(step - 1) : navigation.goBack())} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>添加设备</Text>
      </View>

      <View style={styles.stepBar}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
        ))}
      </View>

      {step === 1 && (
        <View style={styles.content}>
          <Text style={styles.stepTitle}>选择设备类型</Text>
          <View style={styles.typeGrid}>
            {DEVICE_TYPES.map((dt) => (
              <TouchableOpacity
                key={dt.type}
                style={[styles.typeCard, selectedType === dt.type && styles.typeCardActive]}
                onPress={() => setSelectedType(dt.type)}
                activeOpacity={0.8}
              >
                <Text style={styles.typeIcon}>{dt.icon}</Text>
                <Text style={styles.typeLabel}>{dt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.nextBtn, !selectedType && styles.nextBtnDisabled]}
            onPress={() => selectedType && setStep(2)}
            disabled={!selectedType}
            activeOpacity={0.8}
          >
            <Text style={styles.nextBtnText}>下一步</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.content}>
          <Text style={styles.stepTitle}>配对设备</Text>
          <View style={styles.pairingBox}>
            {!pairingDone ? (
              <>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.pairingText}>正在搜索设备...</Text>
              </>
            ) : (
              <>
                <Text style={styles.pairingSuccess}>✅</Text>
                <Text style={styles.pairingText}>配对成功!</Text>
              </>
            )}
          </View>
          {pairingDone && (
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>下一步</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {step === 3 && (
        <View style={styles.content}>
          <Text style={styles.stepTitle}>为设备命名</Text>
          <View style={styles.card}>
            <Text style={styles.label}>设备名称</Text>
            <TextInput
              style={styles.input}
              value={deviceName}
              onChangeText={setDeviceName}
              placeholder={DEVICE_TYPES.find(d => d.type === selectedType)?.label ?? '设备名称'}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={handleConfirm} disabled={binding} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>{binding ? '绑定中...' : '确认绑定'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  backBtn: { padding: SPACING.xs, marginRight: SPACING.sm },
  backText: { fontSize: 28, color: COLORS.text, lineHeight: 32 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.text },
  stepBar: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  stepDotActive: { backgroundColor: COLORS.primary, width: 24 },
  content: { flex: 1, padding: SPACING.md, gap: SPACING.lg },
  stepTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  typeCard: { width: '45%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', gap: SPACING.sm, borderWidth: 2, borderColor: 'transparent', ...SHADOWS.sm },
  typeCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  typeIcon: { fontSize: 36 },
  typeLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  pairingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  pairingSuccess: { fontSize: 64 },
  pairingText: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, gap: SPACING.sm, ...SHADOWS.sm },
  label: { fontSize: 14, color: COLORS.textSecondary },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm, fontSize: 15, color: COLORS.text },
  nextBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  nextBtnDisabled: { backgroundColor: COLORS.textLight },
  nextBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
