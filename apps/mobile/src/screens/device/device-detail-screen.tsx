import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDeviceStore } from '../../stores/device.store';
import * as deviceService from '../../services/device';
import type { DeviceInfo } from '../../services/device';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const DEVICE_ICONS: Record<string, string> = {
  feeder: '🍽',
  fountain: '💧',
  collar: '📿',
  litter_box: '🐱',
};

export function DeviceDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { deviceId } = route.params as { deviceId: number };
  const { unbindDevice } = useDeviceStore();

  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    deviceService.getDevice(deviceId).then((d) => {
      setDevice(d);
      setEditName(d.name);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [deviceId]);

  const handleSaveName = async () => {
    if (!device || editName.trim() === device.name) return;
    setSaving(true);
    try {
      const updated = await deviceService.updateDevice(device.id, { name: editName.trim() });
      setDevice(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('解绑设备', `确定要解绑 "${device?.name}" 吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '解绑', style: 'destructive',
        onPress: async () => {
          if (!device) return;
          await unbindDevice(device.id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator style={{ flex: 1 }} color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>设备详情</Text>
        </View>
        <View style={styles.centered}><Text style={styles.errorText}>设备不存在</Text></View>
      </SafeAreaView>
    );
  }

  const icon = DEVICE_ICONS[device.deviceType] ?? '📦';
  const isOnline = device.status === 'online';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{device.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconRow}>
            <Text style={styles.bigIcon}>{icon}</Text>
            <View style={[styles.statusBadge, { backgroundColor: isOnline ? COLORS.success + '20' : COLORS.textLight + '30' }]}>
              <Text style={[styles.statusText, { color: isOnline ? COLORS.success : COLORS.textLight }]}>
                {isOnline ? '在线' : '离线'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>设备类型</Text>
            <Text style={styles.value}>{device.deviceType}</Text>
          </View>

          {device.batteryLevel != null && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>电量</Text>
              <View style={styles.batteryRow}>
                <View style={styles.batteryBar}>
                  <View style={[styles.batteryFill, {
                    width: `${device.batteryLevel}%` as any,
                    backgroundColor: device.batteryLevel > 20 ? COLORS.success : COLORS.error,
                  }]} />
                </View>
                <Text style={styles.value}>{device.batteryLevel}%</Text>
              </View>
            </View>
          )}

          {device.networkStatus && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>网络状态</Text>
              <Text style={styles.value}>{device.networkStatus}</Text>
            </View>
          )}

          {device.bindTime && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>绑定时间</Text>
              <Text style={styles.value}>{new Date(device.bindTime).toLocaleDateString('zh-CN')}</Text>
            </View>
          )}

          {device.serialNumber && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>序列号</Text>
              <Text style={styles.value}>{device.serialNumber}</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>修改名称</Text>
          <View style={styles.nameRow}>
            <TextInput
              style={styles.nameInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="设备名称"
              placeholderTextColor={COLORS.textLight}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName} disabled={saving} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>{saving ? '保存中' : '保存'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {device.product && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>产品信息</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>产品名称</Text>
              <Text style={styles.value}>{device.product.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>品牌</Text>
              <Text style={styles.value}>{device.product.brand}</Text>
            </View>
            {device.product.specs && Object.entries(device.product.specs).map(([k, v]) => (
              <View key={k} style={styles.infoRow}>
                <Text style={styles.label}>{k}</Text>
                <Text style={styles.value}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
          <Text style={styles.deleteBtnText}>解绑设备</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  backBtn: { padding: SPACING.xs, marginRight: SPACING.sm },
  backText: { fontSize: 28, color: COLORS.text, lineHeight: 32 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.text },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: COLORS.textSecondary },
  content: { padding: SPACING.md, gap: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, ...SHADOWS.sm, gap: SPACING.sm },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  bigIcon: { fontSize: 48 },
  statusBadge: { borderRadius: BORDER_RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 14, color: COLORS.textSecondary },
  value: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  batteryRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  batteryBar: { width: 80, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  batteryFill: { height: '100%', borderRadius: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  nameRow: { flexDirection: 'row', gap: SPACING.sm },
  nameInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, fontSize: 15, color: COLORS.text },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.md, justifyContent: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '600' },
  deleteBtn: { borderWidth: 1.5, borderColor: COLORS.error, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  deleteBtnText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
});
