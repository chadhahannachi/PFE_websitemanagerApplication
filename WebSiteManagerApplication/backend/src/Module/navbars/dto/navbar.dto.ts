import { IsNotEmpty } from "class-validator";

export class NavbarDto {
      
  @IsNotEmpty()  
  titre: string;
  logo: string;
  menu: string;  
} 
