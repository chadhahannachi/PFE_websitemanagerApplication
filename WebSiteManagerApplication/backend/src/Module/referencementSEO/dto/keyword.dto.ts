import { IsNotEmpty } from "class-validator";

export class KeywordDto {
      
  @IsNotEmpty()
      keyword: string;
} 
