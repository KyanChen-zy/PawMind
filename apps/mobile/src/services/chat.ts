import { api } from './api';

export interface MessageInfo { id: number; role: 'user' | 'ai'; content: string; emotionTag: string | null; createdAt: string; }
export interface ConversationInfo { id: number; petId: number; createdAt: string; }

export function createConversation(petId: number): Promise<ConversationInfo> { return api.post(`/pets/${petId}/conversations`, {}); }
export function getConversations(petId: number): Promise<ConversationInfo[]> { return api.get(`/pets/${petId}/conversations`); }
export function sendMessage(conversationId: number, content: string): Promise<{ userMsg: MessageInfo; aiMsg: MessageInfo }> {
  return api.post(`/conversations/${conversationId}/messages`, { content });
}
export function getMessages(conversationId: number): Promise<MessageInfo[]> { return api.get(`/conversations/${conversationId}/messages`); }
