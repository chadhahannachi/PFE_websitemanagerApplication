export interface Payment {
  id: number;
  licence_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_intent_id: string;
  created_at: string;
  updated_at: string;
  licence?: any; // Vous pouvez définir une interface Licence si nécessaire
} 