import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDeviceStore } from '../../stores/device.store';
import type { DeviceProductInfo } from '../../services/device';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const TYPE_COLORS: Record<string, string> = {
  feeder: '#FFD166',
  fountain: '#4ECDC4',
  collar: '#FF6B6B',
  litter_box: '#06D6A0',
};

const TYPE_ICONS: Record<string, string> = {
  feeder: '🍽',
  fountain: '💧',
  collar: '📿',
  litter_box: '🐱',
};

function ProductCard({ product }: { product: DeviceProductInfo }) {
  const color = TYPE_COLORS[product.type] ?? COLORS.border;
  const icon = TYPE_ICONS[product.type] ?? '📦';

  return (
    <View style={styles.card}>
      <View style={[styles.imagePlaceholder, { backgroundColor: color + '40' }]}>
        <Text style={styles.productIcon}>{icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
        {product.price != null && (
          <Text style={styles.price}>¥{product.price.toFixed(2)}</Text>
        )}
        {product.description ? <Text style={styles.desc} numberOfLines={2}>{product.description}</Text> : null}
        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => product.purchaseUrl && Linking.openURL(product.purchaseUrl)}
          activeOpacity={0.8}
        >
          <Text style={styles.detailBtnText}>查看详情</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function DeviceShopScreen() {
  const navigation = useNavigation<any>();
  const { products, loading, fetchProducts } = useDeviceStore();

  useEffect(() => { fetchProducts(); }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>设备商城</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={COLORS.primary} />
      ) : products.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>暂无商品</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
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
  list: { padding: SPACING.md, gap: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', ...SHADOWS.sm },
  imagePlaceholder: { height: 140, alignItems: 'center', justifyContent: 'center' },
  productIcon: { fontSize: 56 },
  cardBody: { padding: SPACING.md, gap: SPACING.xs },
  productName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  brand: { fontSize: 13, color: COLORS.textSecondary },
  price: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  desc: { fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
  detailBtn: { marginTop: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, alignItems: 'center' },
  detailBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  emptyIcon: { fontSize: 64 },
  emptyText: { fontSize: 16, color: COLORS.textSecondary },
});
