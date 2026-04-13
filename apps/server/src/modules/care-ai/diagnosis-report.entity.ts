import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Pet } from '../pet/pet.entity';
import { CareAiSession } from './care-ai-session.entity';

@Entity('diagnosis_reports')
export class DiagnosisReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ nullable: true })
  sessionId: number;

  @ManyToOne(() => CareAiSession, { nullable: true })
  @JoinColumn({ name: 'sessionId' })
  session: CareAiSession;

  @Column({ length: 20 })
  diagnosisType: string;

  @Column()
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  resultSummary: string;

  @Column({ type: 'jsonb', nullable: true })
  resultDetail: Record<string, any>;

  @Column({ default: false })
  savedToRecord: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
