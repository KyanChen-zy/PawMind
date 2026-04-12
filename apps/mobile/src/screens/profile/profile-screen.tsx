import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import { usePetStore } from '../../stores/pet.store';
import { COLORS, SPACING } from '../../constants/theme';

export function ProfileScreen({ navigation }: any) {
  const { logout } = useAuthStore();
  const { pets, currentPet, selectPet } = usePetStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.pageTitle}>我的</Text>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>宠物档案</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddPet')}
            activeOpacity={0.7}
          >
            <Text style={styles.addText}>+ 添加宠物</Text>
          </TouchableOpacity>
        </View>
        {pets.length === 0 ? (
          <TouchableOpacity 
            style={styles.emptyCard} 
            onPress={() => navigation.navigate('AddPet')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyText}>添加你的第一只宠物</Text>
            <Text style={styles.emptySubText}>开始记录宠物的成长和健康</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.petList}>
            {pets.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={[styles.petCard, currentPet?.id === item.id && styles.petCardActive]} 
                onPress={() => selectPet(item)}
                activeOpacity={0.7}
              >
                <View style={styles.petCardContent}>
                  <Text style={styles.petName}>{item.name}</Text>
                  <Text style={styles.petInfo}>{item.breed} · {item.weight}kg</Text>
                </View>
                {currentPet?.id === item.id && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>当前</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity 
        style={styles.logoutBtn} 
        onPress={logout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  pageTitle: { fontSize: 22, fontWeight: '700', padding: SPACING.md },
  section: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, marginHorizontal: SPACING.md, marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  addText: { color: COLORS.primary, fontWeight: '600' },
  petList: { gap: SPACING.sm },
  petCard: { backgroundColor: COLORS.background, borderRadius: 12, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  petCardActive: { borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  petCardContent: { flex: 1 },
  petName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  petInfo: { color: COLORS.textSecondary, fontSize: 13 },
  currentBadge: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  currentBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  emptyCard: { alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.background, borderRadius: 12 },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.sm },
  emptyText: { color: COLORS.textSecondary, fontSize: 16, marginBottom: SPACING.xs },
  emptySubText: { color: COLORS.textLight, fontSize: 14, textAlign: 'center' },
  logoutBtn: { marginHorizontal: SPACING.md, marginTop: SPACING.xl, padding: SPACING.md, borderRadius: 12, borderWidth: 1, borderColor: COLORS.error, alignItems: 'center' },
  logoutText: { color: COLORS.error, fontWeight: '600' },
});
