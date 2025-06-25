import { IsNotEmpty } from "class-validator";

export class LanguageDto {
      
  @IsNotEmpty()  
  nom: string;
} 
