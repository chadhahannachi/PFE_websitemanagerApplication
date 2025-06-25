import { IsNotEmpty } from "class-validator";

export class MenuDto {
      
  @IsNotEmpty()  
  text: string;
  position: string;
  taille: string;
  police: string;
} 
