import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDeviceStore } from '../../stores/device.store';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import type { DeviceInfo } from '../../services/device';

const DEVICE_ICONS: Record<string, string> = {
  feeder: '🍽',
  fountain: '💧',
  collar: '📿',
  litter_box: '🐱',
};

function DeviceCard({ device, onPress }: { device: DeviceInfo; onPress: () => void }) {
  const icon = DEVICE_ICONS[device.deviceType] ?? '📦';
  const isOnline = device.status === 'online';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardLeft}>
        <Text style={styles.deviceIcon}>{icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? COLORS.success : COLORS.textLight }]} />
        </View>
        <Text style={styles.deviceType}>{device.deviceType}</Text>
        {device.pet && <Text style={styles.petName}>绑定宠物: {device.pet.name}</Text>}
        {device.batteryLevel != null && (
          <Text style={styles.battery}>🔋 {device.batteryLevel}%</Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export function DeviceListScreen() {
  const navigation = useNavigation<any>();
  const { devices, loading, fetchDevices } = useDeviceStore();

  useEffect(() => { fetchDevices(); }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>设备管理</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DeviceShop')}>
          <Text style={styles.shopLink}>设备商城</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} />
      ) : devices.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>还没有绑定设备</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('DeviceBindFlow')} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>添加设备</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DeviceShop')} activeOpacity={0.7}>
            <Text style={styles.shopLinkAlt}>浏览设备商城</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <DeviceCard device={item} onPress={() => navigation.navigate('DeviceDetail', { deviceId: item.id })} />
          )}
        />
      )}

      {devices.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('DeviceBindFlow')} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+ 添加设备</Text>
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
  shopLink: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  loader: { flex: 1 },
  list: { padding: SPACING.md, gap: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', ...SHADOWS.sm },
  cardLeft: { marginRight: SPACING.md },
  deviceIcon: { fontSize: 32 },
  cardBody: { flex: 1, gap: 4 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  deviceName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  deviceType: { fontSize: 12, color: COLORS.textLight },
  petName: { fontSize: 13, color: COLORS.textSecondary },
  battery: { fontSize: 12, color: COLORS.textSecondary },
  chevron: { fontSize: 24, color: COLORS.textLight },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  emptyIcon: { fontSize: 64 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
  footer: { padding: SPACING.md },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  shopLinkAlt: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
});
