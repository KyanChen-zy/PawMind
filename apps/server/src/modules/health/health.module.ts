import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthLog } from './health-log.entity';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [TypeOrmModule.forFeature([HealthLog]), PetModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
