import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrowthRecord } from './growth-record.entity';
import { CreateGrowthRecordDto } from './dto/create-growth-record.dto';
import { PetService } from '../pet/pet.service';

@Injectable()
export class GrowthService {
  constructor(
    @InjectRepository(GrowthRecord) private readonly recordRepo: Repository<GrowthRecord>,
    private readonly petService: PetService,
  ) {}

  async create(petId: number, userId: number, dto: CreateGrowthRecordDto): Promise<GrowthRecord> {
    await this.petService.findOne(petId, userId);
    const record = this.recordRepo.create({ ...dto, petId });
    return this.recordRepo.save(record);
  }

  async findByPet(petId: number, userId: number): Promise<GrowthRecord[]> {
    await this.petService.findOne(petId, userId);
    return this.recordRepo.find({ where: { petId }, order: { createdAt: 'DESC' } });
  }

  async remove(id: number, userId: number): Promise<void> {
    const record = await this.recordRepo.findOne({ where: { id } });
    if (!record) return;
    await this.petService.findOne(record.petId, userId);
    await this.recordRepo.remove(record);
  }
}
