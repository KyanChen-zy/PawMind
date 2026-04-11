import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import * as chatService from '../../services/chat';
import type { MessageInfo } from '../../services/chat';
import { COLORS, SPACING } from '../../constants/theme';

const QUICK_TOPICS = ['今天乖不乖', '想我吗', '有没有捣乱', '今天吃什么了'];

export function ChatScreen() {
  const { currentPet } = usePetStore();
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [input, setInput] = useState('');
  const [convId, setConvId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => { if (currentPet) initConversation(); }, [currentPet?.id]);

  const initConversation = async () => {
    if (!currentPet) return;
    try {
      const convs = await chatService.getConversations(currentPet.id);
      let conv;
      if (convs.length > 0) {
        conv = convs[0];
        const msgs = await chatService.getMessages(conv.id);
        setMessages(msgs);
      } else {
        conv = await chatService.createConversation(currentPet.id);
        setMessages([]);
      }
      setConvId(conv.id);
    } catch {}
  };

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || !convId || sending) return;
    setInput('');
    setSending(true);
    try {
      const { userMsg, aiMsg } = await chatService.sendMessage(convId, content);
      setMessages((prev) => [...prev, userMsg, aiMsg]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now(), role: 'ai' as const, content: '宠物有点忙，稍后再试', emotionTag: null, createdAt: new Date().toISOString() }]);
    } finally { setSending(false); }
  };

  if (!currentPet) {
    return (<SafeAreaView style={styles.container}><View style={styles.empty}><Text style={{ fontSize: 40 }}>💬</Text><Text style={styles.emptyText}>先添加宠物档案才能开始对话</Text></View></SafeAreaView>);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>{currentPet.name} 的 AI 分身</Text></View>
      <FlatList ref={listRef} data={messages} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={item.role === 'user' ? styles.userText : styles.aiText}>{item.content}</Text>
            {item.emotionTag && <Text style={styles.emotionTag}>{item.emotionTag}</Text>}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>和 {currentPet.name} 说点什么吧</Text>
            <View style={styles.quickTopics}>
              {QUICK_TOPICS.map((topic) => (
                <TouchableOpacity key={topic} style={styles.topicChip} onPress={() => handleSend(topic)}>
                  <Text style={styles.topicText}>{topic}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputBar}>
          <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="说点什么..." onSubmitEditing={() => handleSend()} />
          <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={() => handleSend()} disabled={!input.trim() || sending}>
            <Text style={styles.sendText}>发送</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 18, fontWeight: '700' },
  messageList: { padding: SPACING.md },
  bubble: { maxWidth: '75%', borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.sm },
  userBubble: { alignSelf: 'flex-end', backgroundColor: COLORS.primary },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: COLORS.surface },
  userText: { color: '#FFF', fontSize: 15 },
  aiText: { color: COLORS.text, fontSize: 15 },
  emotionTag: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  inputBar: { flexDirection: 'row', padding: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: 15 },
  sendBtn: { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: SPACING.md, justifyContent: 'center', marginLeft: SPACING.sm },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { color: '#FFF', fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, marginTop: SPACING.md },
  emptyChat: { alignItems: 'center', paddingTop: 60 },
  emptyChatText: { color: COLORS.textSecondary, fontSize: 16 },
  quickTopics: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: SPACING.lg, gap: SPACING.sm },
  topicChip: { backgroundColor: COLORS.surface, borderRadius: 16, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  topicText: { color: COLORS.primary, fontSize: 14 },
});
