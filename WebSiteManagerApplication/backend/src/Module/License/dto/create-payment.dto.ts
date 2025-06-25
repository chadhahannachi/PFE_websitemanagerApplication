export class CreatePaymentDto {
  licence_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_intent_id: string;
  status?: string;
} 