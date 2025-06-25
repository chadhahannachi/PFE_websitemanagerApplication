import { IsNotEmpty } from "class-validator";

export class PageDto {
      
  @IsNotEmpty()
      titre: string;
      // redirection: string;
} 
