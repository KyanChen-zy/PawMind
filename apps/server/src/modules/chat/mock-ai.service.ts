import { Injectable } from '@nestjs/common';

const MOCK_REPLIES = [
  { content: '喵～今天在家乖乖的，就是有点想你了', emotion: 'calm' },
  { content: '汪！刚才追了一会儿自己的尾巴，可开心了', emotion: 'happy' },
  { content: '嗯...刚睡醒，打了个大大的哈欠', emotion: 'sleepy' },
  { content: '今天偷偷跳上了沙发，嘿嘿别告诉别人', emotion: 'playful' },
  { content: '你什么时候回来呀？我在门口等你好久了', emotion: 'anxious' },
  { content: '刚吃完饭，现在趴在窗台上看外面的小鸟', emotion: 'calm' },
];

@Injectable()
export class MockAiService {
  generateReply(_userMessage: string, _petName: string): { content: string; emotionTag: string } {
    const idx = Math.floor(Math.random() * MOCK_REPLIES.length);
    const reply = MOCK_REPLIES[idx];
    return { content: reply.content, emotionTag: reply.emotion };
  }
}
