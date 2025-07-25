export class UpdateLicenseDto {
    type: 'basic' | 'professional' | 'enterprise';
    status: 'pending' | 'paid' | 'expired' | 'cancelled';
    start_date: Date;
    end_date: Date;
    price: number;
    
  } 