import { IsNotEmpty } from "class-validator";

export class PreferenceDto {
      
  @IsNotEmpty()
  titre: string;
  police: string;
  code: string;
  position: string;
  url: string;
} 
