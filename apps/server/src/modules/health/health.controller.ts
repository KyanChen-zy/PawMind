import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HealthService } from './health.service';
import { CreateHealthLogDto } from './dto/create-health-log.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post('pets/:petId/health-logs')
  create(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }, @Body() dto: CreateHealthLogDto) {
    return this.healthService.create(petId, user.id, dto);
  }

  @Get('pets/:petId/health-logs')
  findAll(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.healthService.findByPet(petId, user.id, startDate, endDate);
  }

  @Get('pets/:petId/health-logs/trends')
  getTrends(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }, @Query('days') days?: string) {
    return this.healthService.getTrends(petId, user.id, days ? parseInt(days) : 7);
  }

  @Get('pets/:petId/health-logs/alerts')
  getAlerts(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }) {
    return this.healthService.getAlerts(petId, user.id);
  }

  @Put('health-logs/:id/resolve')
  resolve(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.healthService.resolveAlert(id, user.id);
  }
}
