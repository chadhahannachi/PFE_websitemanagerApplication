import { IsString, IsOptional } from 'class-validator';

export class UpdateContenuAiDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cardBackgroundColor?: string;

  @IsString()
  @IsOptional()
  sectionTitleColor?: string;

  @IsString()
  @IsOptional()
  sectionDescriptionColor?: string;

  @IsString()
  @IsOptional()
  cardTitleColor?: string;

  @IsString()
  @IsOptional()
  cardDescriptionColor?: string;

  @IsString()
  @IsOptional()
  sectionTitleFont?: string;

  @IsString()
  @IsOptional()
  sectionDescriptionFont?: string;

  @IsString()
  @IsOptional()
  cardTitleFont?: string;

  @IsString()
  @IsOptional()
  cardDescriptionFont?: string;

  @IsString()
  @IsOptional()
  sectionTitleAlign?: string;

  @IsString()
  @IsOptional()
  sectionDescriptionAlign?: string;

  @IsString()
  @IsOptional()
  cardTitleAlign?: string;

  @IsString()
  @IsOptional()
  cardDescriptionAlign?: string;

  @IsString()
  @IsOptional()
  additionalModifications?: string;
} 