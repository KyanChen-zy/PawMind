import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { DeviceProduct } from './device-product.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PetService } from '../pet/pet.service';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
    @InjectRepository(DeviceProduct) private readonly productRepo: Repository<DeviceProduct>,
    private readonly petService: PetService,
  ) {}

  async bindDevice(userId: number, dto: CreateDeviceDto): Promise<Device> {
    await this.petService.findOne(dto.petId, userId);
    const device = this.deviceRepo.create({
      ...dto,
      userId,
      status: 'online',
      bindTime: new Date(),
      batteryLevel: 100,
      networkStatus: 'wifi',
    });
    return this.deviceRepo.save(device);
  }

  async findByUser(userId: number): Promise<Device[]> {
    return this.deviceRepo.find({
      where: { userId },
      relations: ['product', 'pet'],
    });
  }

  async findOne(id: number, userId: number): Promise<Device> {
    const device = await this.deviceRepo.findOne({
      where: { id, userId },
      relations: ['product', 'pet'],
    });
    if (!device) throw new NotFoundException('设备不存在');
    return device;
  }

  async update(id: number, userId: number, dto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id, userId);
    Object.assign(device, dto);
    return this.deviceRepo.save(device);
  }

  async unbind(id: number, userId: number): Promise<void> {
    const device = await this.findOne(id, userId);
    await this.deviceRepo.remove(device);
  }

  async findProducts(): Promise<DeviceProduct[]> {
    return this.productRepo.find();
  }

  async findProduct(id: number): Promise<DeviceProduct> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('产品不存在');
    return product;
  }

  async findByPet(petId: number, userId: number): Promise<Device[]> {
    await this.petService.findOne(petId, userId);
    return this.deviceRepo.find({
      where: { petId, userId },
      relations: ['product', 'pet'],
    });
  }
}
