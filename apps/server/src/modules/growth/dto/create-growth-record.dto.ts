import { IsString, IsIn, IsArray, IsOptional } from 'class-validator';

export class CreateGrowthRecordDto {
  @IsIn(['photo', 'video', 'text']) contentType: string;
  @IsOptional() @IsString() mediaUrl?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}
