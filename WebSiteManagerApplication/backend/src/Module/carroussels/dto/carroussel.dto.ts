import { IsNotEmpty } from "class-validator";

export class CarrousselDto {
      
  @IsNotEmpty()
  titre: string;
  police: string;
  code: string;
  position: string;
  url: string;
  
} 
