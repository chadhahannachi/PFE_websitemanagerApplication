import { IsNotEmpty } from "class-validator";

export class EntrepriseDto {
      
  @IsNotEmpty()
      nom: string;
      contact: string;
      numTel: string;
      adresse: string;
      raisonSociale: string;
} 
