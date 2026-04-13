import { IsString, IsIn, IsNumber } from 'class-validator';

export class CreateDiagnosisDto {
  @IsNumber()
  petId: number;

  @IsIn(['oral', 'stool', 'skin', 'report', 'medicine'])
  diagnosisType: string;

  @IsString()
  imageUrl: string;
}
