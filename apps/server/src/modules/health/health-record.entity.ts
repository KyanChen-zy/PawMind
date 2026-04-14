import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pet } from '../pet/pet.entity';

@Entity('health_records')
export class HealthRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ length: 20 })
  recordType: string;

  @Column({ type: 'date', nullable: true })
  visitDate: string;

  @Column({ length: 100, nullable: true })
  hospitalName: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  prescription: string;

  @Column({ type: 'text', nullable: true })
  doctorAdvice: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ length: 20, nullable: true })
  inputMethod: string;

  @Column({ type: 'jsonb', nullable: true })
  attachments: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
