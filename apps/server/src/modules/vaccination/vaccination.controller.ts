import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaccinationService } from './vaccination.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class VaccinationController {
  constructor(private readonly vaccinationService: VaccinationService) {}

  @Get('pets/:petId/vaccinations')
  findByPet(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }) {
    return this.vaccinationService.findByPet(petId, user.id);
  }

  @Post('pets/:petId/vaccinations')
  create(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
    @Body() dto: CreateVaccinationDto,
  ) {
    return this.vaccinationService.create(petId, user.id, dto);
  }

  @Get('pets/:petId/vaccinations/upcoming')
  findUpcoming(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }) {
    return this.vaccinationService.findUpcoming(petId, user.id);
  }

  @Get('vaccinations/:id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.vaccinationService.findOne(id, user.id);
  }

  @Patch('vaccinations/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateVaccinationDto,
  ) {
    return this.vaccinationService.update(id, user.id, dto);
  }

  @Delete('vaccinations/:id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.vaccinationService.remove(id, user.id);
  }
}
