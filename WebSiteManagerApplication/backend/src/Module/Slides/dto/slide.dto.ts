import { IsNotEmpty } from "class-validator";

export class SlideDto {
      
  @IsNotEmpty()
  titre: string;
  description: string;
  image: string;
} 
