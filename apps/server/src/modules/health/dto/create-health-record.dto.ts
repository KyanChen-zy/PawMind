import { IsIn, IsOptional, IsString, IsDateString, IsArray } from 'class-validator';

export class CreateHealthRecordDto {
  @IsIn(['visit', 'observation'])
  recordType: string;

  @IsOptional()
  @IsDateString()
  visitDate?: string;

  @IsOptional()
  @IsString()
  hospitalName?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsOptional()
  @IsString()
  doctorAdvice?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsIn(['keyboard', 'ocr', 'voice'])
  inputMethod?: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}
