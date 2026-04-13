import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareAiSession } from './care-ai-session.entity';
import { CareAiMessage } from './care-ai-message.entity';
import { DailyTip } from './daily-tip.entity';
import { DiagnosisReport } from './diagnosis-report.entity';
import { PetService } from '../pet/pet.service';
import { matchAnswer } from './mock/knowledge-base';
import { getMockDiagnosis } from './mock/diagnosis-results';

@Injectable()
export class CareAiService {
  constructor(
    @InjectRepository(CareAiSession)
    private readonly sessionRepo: Repository<CareAiSession>,
    @InjectRepository(CareAiMessage)
    private readonly messageRepo: Repository<CareAiMessage>,
    @InjectRepository(DailyTip)
    private readonly tipRepo: Repository<DailyTip>,
    @InjectRepository(DiagnosisReport)
    private readonly diagnosisRepo: Repository<DiagnosisReport>,
    private readonly petService: PetService,
  ) {}

  async createSession(petId: number, userId: number): Promise<CareAiSession> {
    await this.petService.findOne(petId, userId);
    const session = this.sessionRepo.create({ petId });
    return this.sessionRepo.save(session);
  }

  async findSessions(petId: number, userId: number): Promise<CareAiSession[]> {
    await this.petService.findOne(petId, userId);
    return this.sessionRepo.find({
      where: { petId },
      order: { createdAt: 'DESC' },
    });
  }

  async sendMessage(
    sessionId: number,
    userId: number,
    content: string,
  ): Promise<{ userMsg: CareAiMessage; aiMsg: CareAiMessage }> {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('会话不存在');
    await this.petService.findOne(session.petId, userId);

    const userMsg = await this.messageRepo.save(
      this.messageRepo.create({ sessionId, role: 'user', content }),
    );

    const aiContent = matchAnswer(content);
    const aiMsg = await this.messageRepo.save(
      this.messageRepo.create({ sessionId, role: 'assistant', content: aiContent }),
    );

    return { userMsg, aiMsg };
  }

  async getMessages(sessionId: number, userId: number): Promise<CareAiMessage[]> {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('会话不存在');
    await this.petService.findOne(session.petId, userId);
    return this.messageRepo.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  async getDailyTip(): Promise<DailyTip | null> {
    const today = new Date().toISOString().split('T')[0];
    const tip = await this.tipRepo.findOne({
      where: { publishDate: today, isActive: true },
    });
    if (tip) return tip;
    return this.tipRepo.findOne({
      where: { isActive: true },
      order: { publishDate: 'DESC' },
    });
  }

  async getDailyTips(): Promise<DailyTip[]> {
    return this.tipRepo.find({
      where: { isActive: true },
      order: { publishDate: 'DESC' },
    });
  }

  async createDiagnosis(
    petId: number,
    userId: number,
    diagnosisType: string,
    imageUrl: string,
  ): Promise<DiagnosisReport> {
    await this.petService.findOne(petId, userId);
    const mockResult = getMockDiagnosis(diagnosisType);
    const report = this.diagnosisRepo.create({
      petId,
      diagnosisType,
      imageUrl,
      resultSummary: mockResult.summary,
      resultDetail: mockResult.detail,
    });
    return this.diagnosisRepo.save(report);
  }

  async getDiagnosis(id: number, userId: number): Promise<DiagnosisReport> {
    const report = await this.diagnosisRepo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('诊断报告不存在');
    await this.petService.findOne(report.petId, userId);
    return report;
  }

  async getDiagnosisByPet(petId: number, userId: number): Promise<DiagnosisReport[]> {
    await this.petService.findOne(petId, userId);
    return this.diagnosisRepo.find({
      where: { petId },
      order: { createdAt: 'DESC' },
    });
  }
}
