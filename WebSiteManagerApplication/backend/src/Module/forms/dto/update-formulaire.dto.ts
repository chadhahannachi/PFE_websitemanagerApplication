import { PartialType } from '@nestjs/mapped-types';
import { CreateFormulaireDto } from './create-formulaire.dto';

export class UpdateFormulaireDto extends PartialType(CreateFormulaireDto) {}
