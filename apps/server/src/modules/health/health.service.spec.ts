import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HealthService } from './health.service';
import { HealthLog } from './health-log.entity';
import { HealthMetric } from './health-metric.entity';
import { HealthRecord } from './health-record.entity';
import { PetService } from '../pet/pet.service';

describe('HealthService', () => {
  let service: HealthService;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      create: jest.fn((d) => d), save: jest.fn((d) => ({ id: 1, ...d })),
      find: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(null),
    };
    const emptyRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), remove: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: getRepositoryToken(HealthLog), useValue: repo },
        { provide: getRepositoryToken(HealthMetric), useValue: emptyRepo },
        { provide: getRepositoryToken(HealthRecord), useValue: emptyRepo },
        { provide: PetService, useValue: { findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1 }) } },
      ],
    }).compile();
    service = module.get(HealthService);
  });

  it('应成功创建健康日志', async () => {
    const result = await service.create(1, 1, { date: '2026-04-12', weight: 4.5 });
    expect(result.petId).toBe(1);
    expect(repo.save).toHaveBeenCalled();
  });

  it('体重变化超过阈值应触发预警', async () => {
    repo.findOne.mockResolvedValue({ weight: 5.0, date: '2026-04-11' });
    const result = await service.create(1, 1, { date: '2026-04-12', weight: 4.0 });
    expect(result.isAlert).toBe(true);
    expect(result.severity).toBe('urgent');
  });

  it('食欲偏低应触发观察级预警', async () => {
    const result = await service.create(1, 1, { date: '2026-04-12', appetiteLevel: 'low' });
    expect(result.isAlert).toBe(true);
    expect(result.severity).toBe('observe');
  });
});
