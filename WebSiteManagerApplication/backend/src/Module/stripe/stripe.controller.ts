import { Controller, Post, Body, Logger, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('api/stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) {}

  // @Post('create-checkout-session')
  // async createCheckoutSession(
  //   @Body() body: { licenceId: string; amount: number; currency: string },
  // ) {
  //   this.logger.log(`Creating checkout session for licence ${body.licenceId}`);
  //   try {
  //     const session = await this.stripeService.createCheckoutSession(
  //       body.licenceId,
  //       body.amount,
  //       body.currency,
  //     );
  //     return { url: session.url };
  //   } catch (error) {
  //     this.logger.error(`Error creating checkout session: ${error.message}`);
  //     throw error;
  //   }
  // }

  @Post('create-checkout-session')
async createCheckoutSession(
  @Body() body: { licenceId: string; amount: number; currency: string },
) {
  this.logger.log(`Received data: ${JSON.stringify(body)}`);
  try {
    const session = await this.stripeService.createCheckoutSession(
      body.licenceId,
      body.amount,
      body.currency,
    );
    return { url: session.url };
  } catch (error) {
    this.logger.error(`Error creating checkout session: ${error.stack}`);
    throw error;
  }
}

  @Post('webhook')
  async handleWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    this.logger.log('Received Stripe webhook');
    try {
      const result = await this.stripeService.handleWebhook(payload, signature);
      return result;
    } catch (error) {
      this.logger.error(`Error handling webhook: ${error.message}`);
      throw error;
    }
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: { sessionId: string }) {
    this.logger.log(`Verifying payment for session ${body.sessionId}`);
    try {
      const result = await this.stripeService.verifyPayment(body.sessionId);
      return result;
    } catch (error) {
      this.logger.error(`Error verifying payment: ${error.message}`);
      throw error;
    }
  }

  @Post('confirm-verification')
  async confirmVerification(
    @Body() body: { licenceId: string; verificationCode: string },
  ) {
    const { licenceId, verificationCode } = body;
    this.logger.log(`[ConfirmVerification] Début de la vérification pour la licence ${licenceId}`);
    
    try {
      if (!licenceId || !verificationCode) {
        this.logger.error(`[ConfirmVerification] Paramètres manquants: licenceId=${!!licenceId}, verificationCode=${!!verificationCode}`);
        throw new Error('Licence ID et code de vérification sont requis');
      }

      this.logger.debug(`[ConfirmVerification] Appel du service pour la licence ${licenceId}`);
      const result = await this.stripeService.confirmVerification(
        licenceId,
        verificationCode,
      );
      
      this.logger.log(`[ConfirmVerification] Vérification réussie pour la licence ${licenceId}`);
      return result;
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      this.logger.error(`[ConfirmVerification] Erreur lors de la vérification: ${errorMessage}`, error.stack);
      
      if (error.response?.data) {
        this.logger.error(`[ConfirmVerification] Détails de l'erreur: ${JSON.stringify(error.response.data)}`);
      }
      
      throw {
        status: error.response?.status || 500,
        message: errorMessage,
        details: error.response?.data || null
      };
    }
  }
} 