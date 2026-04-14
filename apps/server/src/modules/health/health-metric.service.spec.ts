import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HealthService } from './health.service';
import { HealthLog } from './health-log.entity';
import { HealthMetric } from './health-metric.entity';
import { HealthRecord } from './health-record.entity';
import { PetService } from '../pet/pet.service';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('HealthService - HealthMetric', () => {
  let service: HealthService;
  let metricRepo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: getRepositoryToken(HealthLog), useFactory: mockRepo },
        { provide: getRepositoryToken(HealthMetric), useFactory: mockRepo },
        { provide: getRepositoryToken(HealthRecord), useFactory: mockRepo },
        {
          provide: PetService,
          useValue: { findOne: jest.fn().mockResolvedValue({ id: 1 }) },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    metricRepo = module.get(getRepositoryToken(HealthMetric));
  });

  describe('recordMetric', () => {
    it('should create and save a metric', async () => {
      const dto = {
        petId: 1,
        metricType: 'weight',
        value: 5.5,
        unit: 'kg',
        source: 'manual' as const,
        recordedAt: '2026-04-13T10:00:00Z',
      };
      const created = { ...dto, id: 1, recordedAt: new Date(dto.recordedAt) };
      metricRepo.create.mockReturnValue(created);
      metricRepo.save.mockResolvedValue(created);

      const result = await service.recordMetric(1, dto);

      expect(metricRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ petId: 1, metricType: 'weight', value: 5.5 }),
      );
      expect(metricRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('getMetricSummary', () => {
    it('should return grouped summary by metricType', async () => {
      const now = new Date();
      const metrics: Partial<HealthMetric>[] = [
        { metricType: 'weight', value: 5.0, recordedAt: now } as HealthMetric,
        { metricType: 'weight', value: 5.5, recordedAt: now } as HealthMetric,
        { metricType: 'water', value: 200, recordedAt: now } as HealthMetric,
      ];
      metricRepo.find.mockResolvedValue(metrics);

      const summary = await service.getMetricSummary(1, 1, '7d');

      expect(summary).toHaveProperty('weight');
      expect(summary.weight).toEqual({
        latest: 5.5,
        min: 5.0,
        max: 5.5,
        avg: 5.25,
        count: 2,
      });
      expect(summary).toHaveProperty('water');
      expect(summary.water.count).toBe(1);
    });
  });
});
