import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: number;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column({ length: 10 })
  role: string;

  @Column('text')
  content: string;

  @Column({ nullable: true, length: 20 })
  emotionTag: string;

  @CreateDateColumn()
  createdAt: Date;
}
