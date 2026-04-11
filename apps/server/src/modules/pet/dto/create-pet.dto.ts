import { IsString, IsNumber, IsIn, IsDateString, MaxLength, Min } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsIn(['cat', 'dog', 'other'])
  species: string;

  @IsString()
  @MaxLength(50)
  breed: string;

  @IsDateString()
  birthday: string;

  @IsIn(['male', 'female', 'unknown'])
  gender: string;

  @IsNumber()
  @Min(0)
  weight: number;
}
