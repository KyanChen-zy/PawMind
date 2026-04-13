import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CareAiService } from './care-ai.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('care-ai')
@UseGuards(JwtAuthGuard)
export class CareAiController {
  constructor(private readonly careAiService: CareAiService) {}

  @Post('sessions')
  createSession(
    @Body('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.careAiService.createSession(petId, user.id);
  }

  @Get('sessions')
  findSessions(
    @Query('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.careAiService.findSessions(petId, user.id);
  }

  @Post('sessions/:id/messages')
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.careAiService.sendMessage(id, user.id, dto.content);
  }

  @Get('sessions/:id/messages')
  getMessages(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.careAiService.getMessages(id, user.id);
  }

  @Get('daily-tip')
  getDailyTip() {
    return this.careAiService.getDailyTip();
  }

  @Get('daily-tips')
  getDailyTips() {
    return this.careAiService.getDailyTips();
  }

  @Post('diagnosis')
  createDiagnosis(
    @Body() dto: CreateDiagnosisDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.careAiService.createDiagnosis(dto.petId, user.id, dto.diagnosisType, dto.imageUrl);
  }

  @Get('diagnosis/:id')
  getDiagnosis(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.careAiService.getDiagnosis(id, user.id);
  }

  @Get('diagnosis')
  getDiagnosisByPet(
    @Query('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.careAiService.getDiagnosisByPet(petId, user.id);
  }
}
