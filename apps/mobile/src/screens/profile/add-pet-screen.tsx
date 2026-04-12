import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const SPECIES_OPTIONS = [
  { value: 'cat', label: '猫咪', icon: '🐱' }, 
  { value: 'dog', label: '狗狗', icon: '🐶' }, 
  { value: 'other', label: '其他', icon: '🐹' }
];
const GENDER_OPTIONS = [
  { value: 'male', label: '男孩', icon: '♂' }, 
  { value: 'female', label: '女孩', icon: '♀' }, 
  { value: 'unknown', label: '不确定', icon: '❓' }
];

export function AddPetScreen({ navigation }: any) {
  const { addPet } = usePetStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('cat');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('unknown');
  const [weight, setWeight] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // 入场动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const handleSubmit = async () => {
    if (!name || !breed || !weight) { Alert.alert('提示', '请填写必要信息'); return; }
    try {
      await addPet({ name, species, breed, birthday: birthday || '2024-01-01', gender, weight: parseFloat(weight) });
      Alert.alert('建档成功', `${name} 的档案已创建`, [{ text: '好的', onPress: () => navigation.goBack() }]);
    } catch (e: any) { Alert.alert('建档失败', e.message); }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity 
          onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.back}>{step > 1 ? '上一步' : '返回'}</Text>
        </TouchableOpacity>
        
        <View style={styles.stepIndicator}>
          <View style={styles.stepProgress}>
            <View style={[styles.stepDot, styles.stepDotActive]}></View>
            <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]}></View>
            <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}></View>
            <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]}></View>
            <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]}></View>
          </View>
          <Text style={styles.stepText}>第 {step} 步 / 共 3 步</Text>
        </View>
        
        <Animated.View 
          style={[
            styles.stepContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >

        {step === 1 && (
          <>
            <Text style={styles.title}>你的宠物叫什么名字？</Text>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholder="宠物昵称"
              placeholderTextColor={COLORS.textLight}
              maxLength={20}
            />
            <Text style={styles.label}>宠物类型</Text>
            <View style={styles.chipRow}>
              {SPECIES_OPTIONS.map((opt) => (
                <TouchableOpacity 
                  key={opt.value} 
                  style={[styles.chip, species === opt.value && styles.chipActive]}
                  onPress={() => setSpecies(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipIcon}>{opt.icon}</Text>
                  <Text style={species === opt.value ? styles.chipTextActive : styles.chipText}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={[styles.nextBtn, !name && styles.nextBtnDisabled]} 
              onPress={() => { 
                if (!name) { 
                  Alert.alert('提示', '请输入宠物昵称'); 
                  return; 
                } 
                setStep(2); 
              }}
              disabled={!name}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>下一步</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>{name} 的基本信息</Text>
            <TextInput 
              style={styles.input} 
              value={breed} 
              onChangeText={setBreed} 
              placeholder="品种（如：英短、金毛）"
              placeholderTextColor={COLORS.textLight}
            />
            <TextInput 
              style={styles.input} 
              value={birthday} 
              onChangeText={setBirthday} 
              placeholder="生日（如：2024-01-01）"
              placeholderTextColor={COLORS.textLight}
            />
            <Text style={styles.label}>性别</Text>
            <View style={styles.chipRow}>
              {GENDER_OPTIONS.map((opt) => (
                <TouchableOpacity 
                  key={opt.value} 
                  style={[styles.chip, gender === opt.value && styles.chipActive]}
                  onPress={() => setGender(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipIcon}>{opt.icon}</Text>
                  <Text style={gender === opt.value ? styles.chipTextActive : styles.chipText}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={[styles.nextBtn, !breed && styles.nextBtnDisabled]} 
              onPress={() => { 
                if (!breed) { 
                  Alert.alert('提示', '请输入品种'); 
                  return; 
                } 
                setStep(3); 
              }}
              disabled={!breed}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>下一步</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>最后一步，{name} 多重？</Text>
            <TextInput 
              style={styles.input} 
              value={weight} 
              onChangeText={setWeight} 
              placeholder="体重 (kg)"
              placeholderTextColor={COLORS.textLight}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity 
              style={[styles.submitBtn, !weight && styles.submitBtnDisabled]} 
              onPress={handleSubmit}
              disabled={!weight}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>完成建档</Text>
            </TouchableOpacity>
          </>
        )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  back: { color: COLORS.primary, fontSize: 16, fontWeight: '500' },
  stepIndicator: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  stepProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  stepContent: {
    marginTop: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    color: COLORS.text,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: '500',
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.sm,
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  submitBtn: {
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.sm,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
