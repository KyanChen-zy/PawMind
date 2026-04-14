import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCareAiStore } from '../../stores/care-ai.store';
import { usePetStore } from '../../stores/pet.store';
import type { CareAiMessageInfo } from '../../services/care-ai';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

export function HealthQAScreen() {
  const navigation = useNavigation<any>();
  const { currentPet } = usePetStore();
  const { sessions, messages, startSession, fetchMessages, sendMessage } = useCareAiStore();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    if (!currentPet) return;
    try {
      const session = await startSession(currentPet.id);
      setSessionId(session.id);
      await fetchMessages(session.id);
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || !sessionId || thinking) return;
    const content = input.trim();
    setInput('');
    setThinking(true);
    try {
      await sendMessage(sessionId, content);
    } catch {}
    setThinking(false);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: CareAiMessageInfo }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAi]}>
        {!isUser && <Text style={styles.avatar}>🤖</Text>}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAi]}>
            {item.content}
          </Text>
        </View>
        {isUser && <Text style={styles.avatar}>🐾</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>健康问答</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>有什么宠物健康问题？问我吧 🐾</Text>
            </View>
          }
          ListFooterComponent={
            thinking ? (
              <View style={[styles.msgRow, styles.msgRowAi]}>
                <Text style={styles.avatar}>🤖</Text>
                <View style={[styles.bubble, styles.bubbleAi]}>
                  <Text style={styles.bubbleTextAi}>AI 正在思考...</Text>
                </View>
              </View>
            ) : null
          }
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="输入问题..."
            placeholderTextColor={COLORS.textLight}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || thinking) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || thinking}
            activeOpacity={0.8}
          >
            <Text style={styles.sendBtnText}>发送</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 28, color: COLORS.primary, lineHeight: 32 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  listContent: { padding: SPACING.md, paddingBottom: SPACING.sm },
  emptyContainer: { flex: 1, alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center' },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: SPACING.sm },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAi: { justifyContent: 'flex-start' },
  avatar: { fontSize: 22, marginHorizontal: SPACING.xs },
  bubble: {
    maxWidth: '72%', borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  bubbleUser: { backgroundColor: COLORS.primary },
  bubbleAi: { backgroundColor: COLORS.surface, ...SHADOWS.sm },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  bubbleTextAi: { color: COLORS.text },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  textInput: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    fontSize: 14, color: COLORS.text, marginRight: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sendBtn: {
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, height: 40,
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.textLight },
  sendBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
