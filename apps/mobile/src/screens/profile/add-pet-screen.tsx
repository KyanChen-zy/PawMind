import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import { COLORS, SPACING } from '../../constants/theme';

const SPECIES_OPTIONS = [{ value: 'cat', label: '猫咪' }, { value: 'dog', label: '狗狗' }, { value: 'other', label: '其他' }];
const GENDER_OPTIONS = [{ value: 'male', label: '男孩' }, { value: 'female', label: '女孩' }, { value: 'unknown', label: '不确定' }];

export function AddPetScreen({ navigation }: any) {
  const { addPet } = usePetStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('cat');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('unknown');
  const [weight, setWeight] = useState('');

  const handleSubmit = async () => {
    if (!name || !breed || !weight) { Alert.alert('提示', '请填写必要信息'); return; }
    try {
      await addPet({ name, species, breed, birthday: birthday || '2024-01-01', gender, weight: parseFloat(weight) });
      Alert.alert('建档成功', `${name} 的档案已创建`, [{ text: '好的', onPress: () => navigation.goBack() }]);
    } catch (e: any) { Alert.alert('建档失败', e.message); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
          <Text style={styles.back}>{step > 1 ? '上一步' : '返回'}</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>第 {step} 步 / 共 3 步</Text>

        {step === 1 && (<>
          <Text style={styles.title}>你的宠物叫什么名字？</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="宠物昵称" maxLength={20} />
          <Text style={styles.label}>宠物类型</Text>
          <View style={styles.chipRow}>
            {SPECIES_OPTIONS.map((opt) => (
              <TouchableOpacity key={opt.value} style={[styles.chip, species === opt.value && styles.chipActive]} onPress={() => setSpecies(opt.value)}>
                <Text style={species === opt.value ? styles.chipTextActive : styles.chipText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={() => { if (!name) { Alert.alert('提示', '请输入宠物昵称'); return; } setStep(2); }}>
            <Text style={styles.nextBtnText}>下一步</Text>
          </TouchableOpacity>
        </>)}

        {step === 2 && (<>
          <Text style={styles.title}>{name} 的基本信息</Text>
          <TextInput style={styles.input} value={breed} onChangeText={setBreed} placeholder="品种（如：英短、金毛）" />
          <TextInput style={styles.input} value={birthday} onChangeText={setBirthday} placeholder="生日（如：2024-01-01）" />
          <Text style={styles.label}>性别</Text>
          <View style={styles.chipRow}>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity key={opt.value} style={[styles.chip, gender === opt.value && styles.chipActive]} onPress={() => setGender(opt.value)}>
                <Text style={gender === opt.value ? styles.chipTextActive : styles.chipText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={() => { if (!breed) { Alert.alert('提示', '请输入品种'); return; } setStep(3); }}>
            <Text style={styles.nextBtnText}>下一步</Text>
          </TouchableOpacity>
        </>)}

        {step === 3 && (<>
          <Text style={styles.title}>最后一步，{name} 多重？</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="体重 (kg)" keyboardType="decimal-pad" />
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.nextBtnText}>完成建档</Text>
          </TouchableOpacity>
        </>)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  back: { color: COLORS.primary, fontSize: 16 },
  stepText: { color: COLORS.textSecondary, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  title: { fontSize: 24, fontWeight: '700', marginBottom: SPACING.lg },
  label: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: SPACING.md, fontSize: 16, marginBottom: SPACING.md },
  chipRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  chip: { borderRadius: 16, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary },
  chipTextActive: { color: '#FFF' },
  nextBtn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  submitBtn: { backgroundColor: COLORS.success, borderRadius: 12, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.lg },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});
