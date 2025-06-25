export interface License {
  id: number;
  type: 'basic' | 'professional' | 'enterprise';
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  price: number;
  description?: string;
  stripe_checkout_id?: string;
  stripe_payment_intent_id?: string;
  activated_at?: Date;
  mongo_company_id?: string;
  verification_code?: string;
  licence_request_id: number;
  start_date: Date;
  end_date: Date;
  license_key: string;
  requested_at?: Date;
  validated_at?: Date;
  company_email?: string;
  licenceRequest?: any; // You can create a separate interface for this if needed
  payments?: any[]; // You can create a separate interface for this if needed
}

export interface LicenseStatus {
  status: string;
  message: string;
} 