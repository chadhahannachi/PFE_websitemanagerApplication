import { IsString, IsObject, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePreferenceDto {
  @IsString()
  @IsNotEmpty()
  entreprise: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  preferences: Record<string, number>;
}