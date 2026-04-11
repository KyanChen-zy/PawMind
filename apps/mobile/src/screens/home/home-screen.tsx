import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import { StatusCard } from '../../components/ui/status-card';
import { COLORS, SPACING } from '../../constants/theme';

export function HomeScreen({ navigation }: any) {
  const { currentPet, fetchPets } = usePetStore();
  useEffect(() => { fetchPets(); }, []);

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 60 }}>🐾</Text>
          <Text style={styles.emptyTitle}>先来认识一下你的宠物吧</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPet')}>
            <Text style={styles.addButtonText}>开始建档</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.logo}>🐾 PawMind</Text>
          <Text style={styles.petSwitch}>{currentPet.name}</Text>
        </View>
        <StatusCard petName={currentPet.name} emotion="calm" summary="今天在家乖乖的，吃了两顿饭，活动量正常" />
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Chat')}>
            <Text style={{ fontSize: 28 }}>💬</Text>
            <Text style={styles.actionLabel}>AI 陪伴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Health')}>
            <Text style={{ fontSize: 28 }}>📊</Text>
            <Text style={styles.actionLabel}>记录健康</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Growth')}>
            <Text style={{ fontSize: 28 }}>📸</Text>
            <Text style={styles.actionLabel}>拍照记录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  logo: { fontSize: 20, fontWeight: '700' },
  petSwitch: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyTitle: { fontSize: 18, color: COLORS.textSecondary, marginTop: SPACING.md, marginBottom: SPACING.lg },
  addButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: SPACING.lg, marginHorizontal: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg },
  actionItem: { alignItems: 'center' },
  actionLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: SPACING.xs },
});
