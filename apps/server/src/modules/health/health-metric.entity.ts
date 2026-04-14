import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pet } from '../pet/pet.entity';
import { Device } from '../device/device.entity';

@Entity('health_metrics')
export class HealthMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ length: 30 })
  metricType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ length: 20 })
  unit: string;

  @Column({ length: 10 })
  source: string;

  @Column({ nullable: true })
  deviceId: number;

  @ManyToOne(() => Device, { nullable: true })
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  @Column({ type: 'timestamp' })
  recordedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
