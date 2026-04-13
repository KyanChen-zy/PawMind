import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HealthService } from './health.service';
import { CreateHealthLogDto } from './dto/create-health-log.dto';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';

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

  // HealthMetric endpoints
  @Post('health-metrics')
  recordMetric(@CurrentUser() user: { id: number }, @Body() dto: CreateHealthMetricDto) {
    return this.healthService.recordMetric(user.id, dto);
  }

  @Get('pets/:petId/health-metrics')
  getMetrics(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
    @Query('type') type?: string,
    @Query('range') range?: string,
  ) {
    return this.healthService.getMetrics(petId, user.id, type, range);
  }

  @Get('pets/:petId/health-metrics/summary')
  getMetricSummary(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
    @Query('range') range?: string,
  ) {
    return this.healthService.getMetricSummary(petId, user.id, range ?? '7d');
  }

  // HealthRecord endpoints
  @Post('pets/:petId/health-records')
  createRecord(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
    @Body() dto: CreateHealthRecordDto,
  ) {
    return this.healthService.createRecord(petId, user.id, dto);
  }

  @Get('pets/:petId/health-records')
  findRecords(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }) {
    return this.healthService.findRecords(petId, user.id);
  }

  @Get('health-records/:id')
  findRecord(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.healthService.findRecord(id, user.id);
  }

  @Patch('health-records/:id')
  updateRecord(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdateHealthRecordDto,
  ) {
    return this.healthService.updateRecord(id, user.id, dto);
  }

  @Delete('health-records/:id')
  deleteRecord(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.healthService.deleteRecord(id, user.id);
  }
}
