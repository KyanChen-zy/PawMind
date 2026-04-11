import { IsDateString, IsNumber, IsString, IsIn, IsOptional, Min } from 'class-validator';

export class CreateHealthLogDto {
  @IsDateString() date: string;
  @IsOptional() @IsNumber() @Min(0) weight?: number;
  @IsOptional() @IsIn(['low', 'normal', 'high']) appetiteLevel?: string;
  @IsOptional() @IsIn(['low', 'normal', 'high']) activityLevel?: string;
  @IsOptional() @IsNumber() @Min(0) waterIntake?: number;
  @IsOptional() @IsString() symptoms?: string;
  @IsOptional() @IsString() notes?: string;
}
