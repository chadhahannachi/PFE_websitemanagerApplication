import { IsNotEmpty } from "class-validator";

export class ContenuDto {
      
  @IsNotEmpty()  
  titre: string;
  description: string;
  image: string;
} 
