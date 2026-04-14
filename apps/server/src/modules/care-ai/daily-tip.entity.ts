import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('daily_tips')
export class DailyTip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 200, nullable: true })
  summary: string;

  @Column({ length: 30 })
  category: string;

  @Column({ length: 10, default: 'all' })
  targetSpecies: string;

  @Column({ length: 20, default: 'fixed' })
  source: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  publishDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
