import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './device.entity';
import { DeviceProduct } from './device-product.entity';
import { PetService } from '../pet/pet.service';

describe('DeviceService', () => {
  let service: DeviceService;
  let deviceRepo: Record<string, jest.Mock>;
  let productRepo: Record<string, jest.Mock>;
  let petService: { findOne: jest.Mock };

  beforeEach(async () => {
    deviceRepo = {
      create: jest.fn((d) => d),
      save: jest.fn((d) => Promise.resolve({ id: 1, ...d })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    productRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    };

    petService = {
      findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        { provide: getRepositoryToken(Device), useValue: deviceRepo },
        { provide: getRepositoryToken(DeviceProduct), useValue: productRepo },
        { provide: PetService, useValue: petService },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  describe('bindDevice', () => {
    it('应成功绑定设备并设置默认状态', async () => {
      const dto = { petId: 1, name: '智能喂食器', deviceType: 'feeder' };
      const result = await service.bindDevice(1, dto);

      expect(petService.findOne).toHaveBeenCalledWith(1, 1);
      expect(deviceRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          petId: 1,
          name: '智能喂食器',
          deviceType: 'feeder',
          userId: 1,
          status: 'online',
          batteryLevel: 100,
          networkStatus: 'wifi',
        }),
      );
      expect(deviceRepo.save).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('绑定时 bindTime 应为当前时间', async () => {
      const before = new Date();
      const dto = { petId: 1, name: '智能饮水机', deviceType: 'fountain' };
      const result = await service.bindDevice(1, dto);
      const after = new Date();

      expect(result.bindTime).toBeDefined();
      expect(new Date(result.bindTime).getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
      expect(new Date(result.bindTime).getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
    });

    it('宠物不属于该用户时应抛出异常', async () => {
      petService.findOne.mockRejectedValue(new Error('无权访问该宠物'));
      const dto = { petId: 99, name: '设备', deviceType: 'feeder' };
      await expect(service.bindDevice(1, dto)).rejects.toThrow('无权访问该宠物');
    });
  });

  describe('findByUser', () => {
    it('应返回用户所有设备', async () => {
      const mockDevices = [
        { id: 1, userId: 1, name: '喂食器', deviceType: 'feeder' },
        { id: 2, userId: 1, name: '饮水机', deviceType: 'fountain' },
      ];
      deviceRepo.find.mockResolvedValue(mockDevices);

      const result = await service.findByUser(1);

      expect(deviceRepo.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['product', 'pet'],
      });
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('喂食器');
    });

    it('用户没有设备时应返回空数组', async () => {
      deviceRepo.find.mockResolvedValue([]);
      const result = await service.findByUser(999);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('应返回指定设备', async () => {
      const mockDevice = { id: 1, userId: 1, name: '喂食器' };
      deviceRepo.findOne.mockResolvedValue(mockDevice);

      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockDevice);
    });

    it('设备不存在时应抛出 NotFoundException', async () => {
      deviceRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findProducts', () => {
    it('应返回所有产品列表', async () => {
      const mockProducts = [{ id: 1, name: '智能喂食器Pro', type: 'feeder' }];
      productRepo.find.mockResolvedValue(mockProducts);

      const result = await service.findProducts();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('unbind', () => {
    it('应成功解绑设备', async () => {
      const mockDevice = { id: 1, userId: 1, name: '喂食器' };
      deviceRepo.findOne.mockResolvedValue(mockDevice);

      await service.unbind(1, 1);
      expect(deviceRepo.remove).toHaveBeenCalledWith(mockDevice);
    });
  });
});
