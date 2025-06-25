import { IsNotEmpty } from "class-validator";

export class FormulaireDto {
      
  @IsNotEmpty()
  titre: string;

} 
