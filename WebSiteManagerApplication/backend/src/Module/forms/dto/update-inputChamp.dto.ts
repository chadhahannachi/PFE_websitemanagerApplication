import { PartialType } from '@nestjs/mapped-types';
import { CreateInputChampDto } from './create-inputChamp.dto';

export class UpdateInputChampDto extends PartialType(CreateInputChampDto) {}
