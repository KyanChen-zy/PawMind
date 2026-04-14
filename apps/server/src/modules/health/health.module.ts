import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthLog } from './health-log.entity';
import { HealthMetric } from './health-metric.entity';
import { HealthRecord } from './health-record.entity';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [TypeOrmModule.forFeature([HealthLog, HealthMetric, HealthRecord]), PetModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
