export class CreateLicenseDto {
  licence_request_id: number;
  type: 'basic' | 'professional' | 'enterprise';
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  start_date: Date;
  end_date: Date;
  price: number;
  description?: string;
  license_key?: string;
  validated_at?: Date;
  activated_at?: Date;
  mongo_company_id?: string;
  company_email?: string;
} 