import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaccination } from './vaccination.entity';
import { VaccinationService } from './vaccination.service';
import { VaccinationController } from './vaccination.controller';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vaccination]), PetModule],
  controllers: [VaccinationController],
  providers: [VaccinationService],
})
export class VaccinationModule {}
