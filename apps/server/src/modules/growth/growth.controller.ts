import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GrowthService } from './growth.service';
import { CreateGrowthRecordDto } from './dto/create-growth-record.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Post('pets/:petId/growth-records')
  create(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }, @Body() dto: CreateGrowthRecordDto) {
    return this.growthService.create(petId, user.id, dto);
  }

  @Get('pets/:petId/growth-records')
  findAll(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }) {
    return this.growthService.findByPet(petId, user.id);
  }

  @Delete('growth-records/:id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.growthService.remove(id, user.id);
  }
}
