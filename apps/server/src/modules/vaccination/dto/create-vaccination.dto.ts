import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateVaccinationDto {
  @IsString()
  vaccineName: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsDateString()
  vaccinationDate: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  batchNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
