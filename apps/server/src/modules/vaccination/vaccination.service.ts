import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Vaccination } from './vaccination.entity';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { PetService } from '../pet/pet.service';

@Injectable()
export class VaccinationService {
  constructor(
    @InjectRepository(Vaccination) private readonly repo: Repository<Vaccination>,
    private readonly petService: PetService,
  ) {}

  async create(petId: number, userId: number, dto: CreateVaccinationDto): Promise<Vaccination> {
    await this.petService.findOne(petId, userId);
    const vaccination = this.repo.create({ ...dto, petId });
    return this.repo.save(vaccination);
  }

  async findByPet(petId: number, userId: number): Promise<Vaccination[]> {
    await this.petService.findOne(petId, userId);
    return this.repo.find({ where: { petId }, order: { vaccinationDate: 'DESC' } });
  }

  async findUpcoming(petId: number, userId: number): Promise<Vaccination[]> {
    await this.petService.findOne(petId, userId);
    const today = new Date().toISOString().split('T')[0];
    return this.repo.find({
      where: { petId, nextDueDate: MoreThanOrEqual(today) },
      order: { nextDueDate: 'ASC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Vaccination> {
    const vaccination = await this.repo.findOne({ where: { id }, relations: ['pet'] });
    if (!vaccination) throw new NotFoundException('疫苗记录不存在');
    await this.petService.findOne(vaccination.petId, userId);
    return vaccination;
  }

  async update(id: number, userId: number, dto: UpdateVaccinationDto): Promise<Vaccination> {
    const vaccination = await this.findOne(id, userId);
    Object.assign(vaccination, dto);
    return this.repo.save(vaccination);
  }

  async remove(id: number, userId: number): Promise<void> {
    const vaccination = await this.findOne(id, userId);
    await this.repo.remove(vaccination);
  }
}
