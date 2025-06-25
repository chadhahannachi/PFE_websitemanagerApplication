import { Controller, Get, Post, Put, Delete, Body, Param, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('api/payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async getAllPayments() {
    this.logger.log('Getting all payments');
    return this.paymentService.getAllPayments();
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    this.logger.log(`Getting payment with id: ${id}`);
    try {
      return await this.paymentService.getPaymentById(id);
    } catch (error: any) {
      this.logger.error(`Error in getPaymentById controller for id ${id}: ${error.message || error}`, error);
      throw new HttpException(
        error.message || 'Failed to retrieve payment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async createPayment(@Body() paymentData: {
    licence_id: string;
    amount: number;
    payment_method: string;
    currency: string;
    notes?: string;
  }) {
    this.logger.log('Creating new payment');
    return this.paymentService.createPayment(paymentData);
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body() updateData: {
      status?: string;
      notes?: string;
    },
  ) {
    this.logger.log(`Updating payment with id: ${id}`);
    return this.paymentService.updatePayment(id, updateData);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    this.logger.log(`Deleting payment with id: ${id}`);
    return this.paymentService.deletePayment(id);
  }

  @Get('licence/:licenceId')
  async getLicencePayments(@Param('licenceId') licenceId: string) {
    this.logger.log(`Getting payments for licence: ${licenceId}`);
    return this.paymentService.getLicencePayments(licenceId);
  }

  @Put(':id/status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    this.logger.log(`Updating payment status for id: ${id}`);
    return this.paymentService.updatePaymentStatus(id, status);
  }
} 