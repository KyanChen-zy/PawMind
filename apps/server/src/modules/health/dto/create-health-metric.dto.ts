import { IsNumber, IsIn, IsString, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateHealthMetricDto {
  @IsNumber()
  petId: number;

  @IsIn(['water', 'food', 'exercise', 'sleep', 'temperature', 'heart_rate', 'stool', 'weight'])
  metricType: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsString()
  unit: string;

  @IsIn(['device', 'manual'])
  source: string;

  @IsOptional()
  @IsNumber()
  deviceId?: number;

  @IsDateString()
  recordedAt: string;
}
