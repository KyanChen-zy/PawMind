import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { VaccinationService } from './vaccination.service';
import { Vaccination } from './vaccination.entity';
import { PetService } from '../pet/pet.service';

describe('VaccinationService', () => {
  let service: VaccinationService;
  let repo: Record<string, jest.Mock>;
  let petService: { findOne: jest.Mock };

  beforeEach(async () => {
    repo = {
      create: jest.fn((d) => d),
      save: jest.fn((d) => Promise.resolve({ id: 1, ...d })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    petService = { findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1 }) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VaccinationService,
        { provide: getRepositoryToken(Vaccination), useValue: repo },
        { provide: PetService, useValue: petService },
      ],
    }).compile();

    service = module.get(VaccinationService);
  });

  it('应成功创建疫苗记录', async () => {
    const dto = { vaccineName: '狂犬疫苗', vaccinationDate: '2026-04-01' };
    const result = await service.create(1, 1, dto);
    expect(result.petId).toBe(1);
    expect(result.vaccineName).toBe('狂犬疫苗');
    expect(repo.save).toHaveBeenCalled();
  });

  it('应按宠物ID查询疫苗记录', async () => {
    const mockVaccinations = [
      { id: 1, petId: 1, vaccineName: '狂犬疫苗', vaccinationDate: '2026-04-01' },
      { id: 2, petId: 1, vaccineName: '猫三联', vaccinationDate: '2026-03-01' },
    ];
    repo.find.mockResolvedValue(mockVaccinations);
    const result = await service.findByPet(1, 1);
    expect(result).toHaveLength(2);
    expect(repo.find).toHaveBeenCalledWith({ where: { petId: 1 }, order: { vaccinationDate: 'DESC' } });
  });

  it('findOne 找不到记录时应抛出 NotFoundException', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
  });
});
