import { IsNotEmpty } from "class-validator";

export class RedirectionDto {
      
  @IsNotEmpty()
      urlSource: string;
      urlCible: string;
} 
