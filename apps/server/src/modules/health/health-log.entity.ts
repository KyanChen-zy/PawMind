import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pet } from '../pet/pet.entity';

@Entity('health_logs')
export class HealthLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ nullable: true, length: 10 })
  appetiteLevel: string;

  @Column({ nullable: true, length: 10 })
  activityLevel: string;

  @Column({ type: 'int', nullable: true })
  waterIntake: number;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isAlert: boolean;

  @Column({ nullable: true, length: 50 })
  alertType: string;

  @Column({ nullable: true, length: 10 })
  severity: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
