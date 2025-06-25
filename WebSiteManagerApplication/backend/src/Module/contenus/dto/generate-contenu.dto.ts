import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class GenerateContenuDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  selectedComponentId: string;

  @IsString()
  @IsOptional()
  stylePreferences?: string;

  @IsString()
  rawContent: string;
} 