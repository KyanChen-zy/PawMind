import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareAiSession } from './care-ai-session.entity';
import { CareAiMessage } from './care-ai-message.entity';
import { DailyTip } from './daily-tip.entity';
import { DiagnosisReport } from './diagnosis-report.entity';
import { CareAiService } from './care-ai.service';
import { CareAiController } from './care-ai.controller';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CareAiSession, CareAiMessage, DailyTip, DiagnosisReport]),
    PetModule,
  ],
  controllers: [CareAiController],
  providers: [CareAiService],
})
export class CareAiModule {}
