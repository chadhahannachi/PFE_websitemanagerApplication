import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export enum Role {
  SuperAdminABshore = 'superadminabshore',
  SuperAdminEntreprise = 'superadminentreprise',
  Moderateur = 'moderateur',
  Visiteur = 'visiteur'
}

export class SignUpDto {
  // @IsNotEmpty()
  // @IsString()
  // readonly nom: string;

  // @IsNotEmpty()
  // @IsEmail({}, { message: 'Please enter correct email' })
  // readonly email: string;

  // @IsNotEmpty()
  // @IsString()
  // @MinLength(6)
  // readonly password: string;

  
  // @IsNotEmpty()
  // nomEntreprise?: string;

  // @IsNotEmpty()
  // readonly role: Role;

  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  nom: string;

  @IsEmail({}, { message: 'Format d\'email invalide' })
  @IsNotEmpty({ message: 'L\'email est requis' })
  email: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  @Matches(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
  @Matches(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
  password: string;

  @IsNotEmpty({ message: 'Le nom de l\'entreprise est requis' })
  nomEntreprise: string;

  @IsNotEmpty({ message: 'Le rôle est requis' })
  role: Role;
  
}
