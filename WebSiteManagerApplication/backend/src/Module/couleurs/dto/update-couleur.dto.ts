import { PartialType } from '@nestjs/mapped-types';
import { CreateCouleurDto } from './create-couleur.dto';

export class UpdateCouleurDto extends PartialType(CreateCouleurDto) {}
