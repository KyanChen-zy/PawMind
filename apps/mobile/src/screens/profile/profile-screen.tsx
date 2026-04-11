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
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>我的</Text>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>宠物档案</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddPet')}><Text style={styles.addText}>+ 添加宠物</Text></TouchableOpacity>
        </View>
        {pets.length === 0 ? (
          <TouchableOpacity style={styles.emptyCard} onPress={() => navigation.navigate('AddPet')}>
            <Text style={{ fontSize: 30 }}>🐾</Text><Text style={styles.emptyText}>添加你的第一只宠物</Text>
          </TouchableOpacity>
        ) : (
          <FlatList data={pets} keyExtractor={(item) => String(item.id)} scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.petCard, currentPet?.id === item.id && styles.petCardActive]} onPress={() => selectPet(item)}>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petInfo}>{item.breed} · {item.weight}kg</Text>
                {currentPet?.id === item.id && <Text style={styles.currentBadge}>当前</Text>}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}><Text style={styles.logoutText}>退出登录</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  pageTitle: { fontSize: 22, fontWeight: '700', padding: SPACING.md },
  section: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, marginHorizontal: SPACING.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  addText: { color: COLORS.primary, fontWeight: '600' },
  petCard: { backgroundColor: COLORS.background, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center' },
  petCardActive: { borderWidth: 2, borderColor: COLORS.primary },
  petName: { fontSize: 16, fontWeight: '600', flex: 1 },
  petInfo: { color: COLORS.textSecondary, fontSize: 13 },
  currentBadge: { color: COLORS.primary, fontSize: 12, fontWeight: '600', marginLeft: SPACING.sm },
  emptyCard: { alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.background, borderRadius: 12 },
  emptyText: { color: COLORS.textSecondary, marginTop: SPACING.sm },
  logoutBtn: { marginHorizontal: SPACING.md, marginTop: SPACING.xl, padding: SPACING.md, borderRadius: 12, borderWidth: 1, borderColor: COLORS.error, alignItems: 'center' },
  logoutText: { color: COLORS.error, fontWeight: '600' },
});
