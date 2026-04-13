import { IsNumber, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateDeviceDto {
  @IsNumber()
  petId: number;

  @IsString()
  name: string;

  @IsIn(['feeder', 'fountain', 'collar', 'litter_box'])
  deviceType: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsNumber()
  productId?: number;
}
