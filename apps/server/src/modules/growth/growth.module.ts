import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowthRecord } from './growth-record.entity';
import { GrowthService } from './growth.service';
import { GrowthController } from './growth.controller';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [TypeOrmModule.forFeature([GrowthRecord]), PetModule],
  controllers: [GrowthController],
  providers: [GrowthService],
})
export class GrowthModule {}
