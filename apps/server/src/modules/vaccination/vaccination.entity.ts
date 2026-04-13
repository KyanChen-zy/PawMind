import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pet } from '../pet/pet.entity';

@Entity('vaccinations')
export class Vaccination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ length: 100 })
  vaccineName: string;

  @Column({ length: 50, nullable: true })
  barcode: string;

  @Column({ type: 'date' })
  vaccinationDate: string;

  @Column({ type: 'date', nullable: true })
  expiryDate: string;

  @Column({ type: 'date', nullable: true })
  nextDueDate: string;

  @Column({ length: 100, nullable: true })
  institution: string;

  @Column({ length: 50, nullable: true })
  batchNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
