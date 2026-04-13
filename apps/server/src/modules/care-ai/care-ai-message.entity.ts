import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { CareAiSession } from './care-ai-session.entity';

@Entity('care_ai_messages')
export class CareAiMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: number;

  @ManyToOne(() => CareAiSession)
  @JoinColumn({ name: 'sessionId' })
  session: CareAiSession;

  @Column({ length: 10 })
  role: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
