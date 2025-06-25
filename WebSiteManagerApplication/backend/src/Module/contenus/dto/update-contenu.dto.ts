import { PartialType } from '@nestjs/mapped-types';
import { CreateContenuDto } from './create-contenu.dto';

export class UpdateContenuDto extends PartialType(CreateContenuDto) {}
