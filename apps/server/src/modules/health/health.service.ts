import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { HealthLog } from './health-log.entity';
import { HealthMetric } from './health-metric.entity';
import { HealthRecord } from './health-record.entity';
import { CreateHealthLogDto } from './dto/create-health-log.dto';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
import { PetService } from '../pet/pet.service';

const WEIGHT_THRESHOLD = 0.05;

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthLog) private readonly logRepo: Repository<HealthLog>,
    @InjectRepository(HealthMetric) private readonly metricRepo: Repository<HealthMetric>,
    @InjectRepository(HealthRecord) private readonly recordRepo: Repository<HealthRecord>,
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

  // HealthMetric methods
  async recordMetric(userId: number, dto: CreateHealthMetricDto): Promise<HealthMetric> {
    await this.petService.findOne(dto.petId, userId);
    const metric = this.metricRepo.create({ ...dto, recordedAt: new Date(dto.recordedAt) });
    return this.metricRepo.save(metric);
  }

  async getMetrics(petId: number, userId: number, type?: string, range?: string): Promise<HealthMetric[]> {
    await this.petService.findOne(petId, userId);
    const since = new Date();
    if (range === '24h') since.setHours(since.getHours() - 24);
    else since.setDate(since.getDate() - 7);
    const where: any = { petId, recordedAt: MoreThanOrEqual(since) };
    if (type) where.metricType = type;
    return this.metricRepo.find({ where, order: { recordedAt: 'ASC' } });
  }

  async getMetricSummary(petId: number, userId: number, range: string): Promise<Record<string, any>> {
    const metrics = await this.getMetrics(petId, userId, undefined, range);
    const grouped: Record<string, HealthMetric[]> = {};
    for (const m of metrics) {
      if (!grouped[m.metricType]) grouped[m.metricType] = [];
      grouped[m.metricType].push(m);
    }
    const summary: Record<string, any> = {};
    for (const [type, items] of Object.entries(grouped)) {
      const values = items.map(i => Number(i.value));
      summary[type] = {
        latest: values[values.length - 1],
        min: Math.min(...values),
        max: Math.max(...values),
        avg: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100,
        count: values.length,
      };
    }
    return summary;
  }

  // HealthRecord methods
  async createRecord(petId: number, userId: number, dto: CreateHealthRecordDto): Promise<HealthRecord> {
    await this.petService.findOne(petId, userId);
    const record = this.recordRepo.create({ ...dto, petId });
    return this.recordRepo.save(record);
  }

  async findRecords(petId: number, userId: number): Promise<HealthRecord[]> {
    await this.petService.findOne(petId, userId);
    return this.recordRepo.find({ where: { petId }, order: { createdAt: 'DESC' } });
  }

  async findRecord(id: number, userId: number): Promise<HealthRecord> {
    const record = await this.recordRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('记录不存在');
    await this.petService.findOne(record.petId, userId);
    return record;
  }

  async updateRecord(id: number, userId: number, dto: UpdateHealthRecordDto): Promise<HealthRecord> {
    const record = await this.findRecord(id, userId);
    Object.assign(record, dto);
    return this.recordRepo.save(record);
  }

  async deleteRecord(id: number, userId: number): Promise<void> {
    const record = await this.findRecord(id, userId);
    await this.recordRepo.remove(record);
  }
}
