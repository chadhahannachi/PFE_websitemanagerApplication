import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export enum Role {
  SuperAdminABshore = 'superadminabshore',
  SuperAdminEntreprise = 'superadminentreprise',
  Moderateur = 'moderateur',
  Visiteur = 'visiteur'
}

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly nom: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  
  @IsNotEmpty()
  nomEntreprise?: string;

  @IsNotEmpty()
  readonly role: Role;
}
