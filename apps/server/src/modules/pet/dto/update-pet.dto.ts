import { IsString, IsNumber, IsIn, IsDateString, IsArray, IsOptional, MaxLength, Min } from 'class-validator';

export class UpdatePetDto {
  @IsOptional() @IsString() @MaxLength(20) name?: string;
  @IsOptional() @IsString() @MaxLength(50) breed?: string;
  @IsOptional() @IsDateString() birthday?: string;
  @IsOptional() @IsIn(['male', 'female', 'unknown']) gender?: string;
  @IsOptional() @IsNumber() @Min(0) weight?: number;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) personalityTags?: string[];
}
