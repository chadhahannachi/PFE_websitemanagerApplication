export interface LicenseRequest {
  id: number;
  mongo_company_id: string;
  company_name: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  company?: any; // Vous pouvez définir une interface Company si nécessaire
  licence?: any; // Vous pouvez définir une interface Licence si nécessaire
} 