import { PartialType } from '@nestjs/mapped-types';
import { CreateNavbarDto } from './create-navbar.dto';

export class UpdateNavbarDto extends PartialType(CreateNavbarDto) {}
