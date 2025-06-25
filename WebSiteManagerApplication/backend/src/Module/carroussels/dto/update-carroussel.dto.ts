import { PartialType } from '@nestjs/mapped-types';
import { CreateCarrousselDto } from './create-carroussel.dto';

export class UpdateCarrousselDto extends PartialType(CreateCarrousselDto) {}
