import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { HealthLog } from './health-log.entity';
import { CreateHealthLogDto } from './dto/create-health-log.dto';
import { PetService } from '../pet/pet.service';

const WEIGHT_THRESHOLD = 0.05;

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthLog) private readonly logRepo: Repository<HealthLog>,
    private readonly petService: PetService,
  ) {}

  async create(petId: number, userId: number, dto: CreateHealthLogDto): Promise<HealthLog> {
    await this.petService.findOne(petId, userId);
    const log = this.logRepo.create({ ...dto, petId });

    if (dto.weight) {
      const lastLog = await this.logRepo.findOne({ where: { petId }, order: { date: 'DESC' } });
      if (lastLog?.weight) {
        const change = Math.abs((dto.weight - Number(lastLog.weight)) / Number(lastLog.weight));
        if (change >= WEIGHT_THRESHOLD) {
          log.isAlert = true;
          log.alertType = '体重异常变化';
          log.severity = change >= 0.1 ? 'urgent' : 'caution';
        }
      }
    }

    if (dto.appetiteLevel === 'low') {
      log.isAlert = true;
      log.alertType = log.alertType ? `${log.alertType}; 食欲偏低` : '食欲偏低';
      log.severity = log.severity || 'observe';
    }

    return this.logRepo.save(log);
  }

  async findByPet(petId: number, userId: number, startDate?: string, endDate?: string): Promise<HealthLog[]> {
    await this.petService.findOne(petId, userId);
    const where: any = { petId };
    if (startDate && endDate) where.date = Between(startDate, endDate);
    return this.logRepo.find({ where, order: { date: 'DESC' } });
  }

  async getTrends(petId: number, userId: number, days: number = 7): Promise<HealthLog[]> {
    await this.petService.findOne(petId, userId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const dateStr = startDate.toISOString().split('T')[0];
    return this.logRepo.find({
      where: { petId, date: Between(dateStr, new Date().toISOString().split('T')[0]) },
      order: { date: 'ASC' },
    });
  }

  async getAlerts(petId: number, userId: number): Promise<HealthLog[]> {
    await this.petService.findOne(petId, userId);
    return this.logRepo.find({ where: { petId, isAlert: true }, order: { date: 'DESC' } });
  }

  async resolveAlert(logId: number, userId: number): Promise<HealthLog> {
    const log = await this.logRepo.findOne({ where: { id: logId } });
    if (!log) throw new NotFoundException('日志不存在');
    await this.petService.findOne(log.petId, userId);
    log.isAlert = false;
    return this.logRepo.save(log);
  }
}
