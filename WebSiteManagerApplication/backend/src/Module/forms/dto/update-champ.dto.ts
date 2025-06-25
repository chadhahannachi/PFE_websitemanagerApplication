import { PartialType } from '@nestjs/mapped-types';
import { CreateChampDto } from './create-champ.dto';

export class UpdateChampDto extends PartialType(CreateChampDto) {}
