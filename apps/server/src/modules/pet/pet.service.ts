import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
  ) {}

  async create(userId: number, dto: CreatePetDto): Promise<Pet> {
    const pet = this.petRepo.create({ ...dto, userId });
    return this.petRepo.save(pet);
  }

  async findAllByUser(userId: number): Promise<Pet[]> {
    return this.petRepo.find({
      where: { userId, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Pet> {
    const pet = await this.petRepo.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('宠物不存在');
    if (pet.userId !== userId) throw new ForbiddenException('无权访问该宠物');
    return pet;
  }

  async update(id: number, userId: number, dto: UpdatePetDto): Promise<Pet> {
    const pet = await this.findOne(id, userId);
    Object.assign(pet, dto);
    return this.petRepo.save(pet);
  }

  async archive(id: number, userId: number): Promise<void> {
    const pet = await this.findOne(id, userId);
    pet.status = 'archived';
    await this.petRepo.save(pet);
  }
}
