import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, validate } from 'class-validator';
import { Role } from './signup.dto';


export class EditProfileDto {
  @IsNotEmpty()
  @IsString()
  readonly nom: string;

  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  readonly password?: string; // Rendre le champ password optionnel


  async validatePassword(): Promise<string[]> {
    if (!this.password) {
      return [];
    }
    const errors = await validate(this);
    return errors.map(error => Object.values(error.constraints)).flat();
  }

  @IsString()
  readonly image?: string; 
}
