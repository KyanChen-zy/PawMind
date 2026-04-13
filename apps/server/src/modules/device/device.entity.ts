import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Pet } from '../pet/pet.entity';
import { DeviceProduct } from './device-product.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ nullable: true })
  productId: number;

  @ManyToOne(() => DeviceProduct, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product: DeviceProduct;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 30 })
  deviceType: string;

  @Column({ length: 100, nullable: true })
  serialNumber: string;

  @Column({ length: 20, default: 'offline' })
  status: string;

  @Column({ type: 'int', nullable: true })
  batteryLevel: number;

  @Column({ length: 20, nullable: true })
  networkStatus: string;

  @Column({ type: 'timestamp', nullable: true })
  bindTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
