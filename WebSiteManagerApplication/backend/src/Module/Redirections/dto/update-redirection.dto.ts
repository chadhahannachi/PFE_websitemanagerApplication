import { PartialType } from '@nestjs/mapped-types';
import { CreateRedirectionDto } from './create-redirection.dto';

export class UpdateRedirectionDto extends PartialType(CreateRedirectionDto) {}
