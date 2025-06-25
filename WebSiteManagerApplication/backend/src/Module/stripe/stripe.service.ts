import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly laravelApiUrl = 'http://127.0.0.1:8000';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async createCheckoutSession(licenceId: string, amount: number, currency: string = 'eur') {
    try {
      this.logger.log(`Creating checkout session for licence ${licenceId}`);
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.laravelApiUrl}/checkout`,
          {
            licence_id: licenceId,
            amount: amount,
            currency: currency
          }
        )
      );

      this.logger.log(`Laravel response: ${JSON.stringify(response.data)}`);

      if (!response.data.url) {
        throw new Error('URL de paiement non reçue de Laravel');
      }

      return response.data;
    } catch (error) {
      this.logger.error(`Error creating checkout session: ${error.message}`);
      if (error.response?.data) {
        this.logger.error(`Laravel error response: ${JSON.stringify(error.response.data)}`);
      }
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async verifyPayment(sessionId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.laravelApiUrl}/payment/verify?session_id=${sessionId}`
        ) 
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error verifying payment: ${error.message}`);
      throw new Error(`Erreur lors de la vérification du paiement: ${error.message}`);
    }
  }

  async confirmVerification(licenceId: string, verificationCode: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.laravelApiUrl}/payment/confirm-verification`,
          {
            licence_id: licenceId,
            verification_code: verificationCode
          }
        )
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error confirming verification: ${error.message}`);
      throw new Error(`Erreur lors de la confirmation de la vérification: ${error.message}`);
    }
  }

  async handleWebhook(payload: any, signature: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.laravelApiUrl}/stripe/webhook`,
          payload,
          {
            headers: {
              'Stripe-Signature': signature
            }
          }
        )
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error handling webhook: ${error.message}`);
      throw new Error(`Erreur lors du traitement du webhook: ${error.message}`);
    }
  }

  async getPaymentStatus(sessionId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.laravelApiUrl}/api/payment/${sessionId}/status`
        )
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error getting payment status: ${error.message}`);
      throw new Error(`Erreur lors de la récupération du statut du paiement: ${error.message}`);
    }
  }
} 