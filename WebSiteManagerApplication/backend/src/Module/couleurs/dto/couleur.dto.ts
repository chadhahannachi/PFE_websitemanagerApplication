import { IsNotEmpty } from "class-validator";

export class CouleurDto {
      
  @IsNotEmpty()
      couleur: string;
} 
