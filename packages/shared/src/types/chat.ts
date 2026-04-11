/** 对话消息角色 */
export type MessageRole = 'user' | 'ai';

/** 情绪标签 */
export type EmotionTag =
  | 'happy'
  | 'calm'
  | 'anxious'
  | 'excited'
  | 'sleepy'
  | 'playful';

/** 发送消息请求 */
export interface SendMessageDto {
  content: string;
}

/** 消息响应 */
export interface MessageInfo {
  id: number;
  role: MessageRole;
  content: string;
  emotionTag: EmotionTag | null;
  createdAt: string;
}

/** 对话会话响应 */
export interface ConversationInfo {
  id: number;
  petId: number;
  createdAt: string;
  lastMessage: string | null;
}
