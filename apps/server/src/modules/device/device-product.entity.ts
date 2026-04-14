import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('device_products')
export class DeviceProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 30 })
  type: string;

  @Column({ length: 50 })
  brand: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  specs: Record<string, string>;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  purchaseUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @CreateDateColumn()
  createdAt: Date;
}
