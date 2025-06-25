import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './interfaces/payment.interface';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async getAllPayments() {
    try {
      return await this.paymentService.getAllPayments();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch payments',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getPayment(@Param('id') id: string): Promise<Payment> {
    try {
      return await this.paymentService.getPayment(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch payment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async createPayment(@Body() paymentData: CreatePaymentDto): Promise<Payment> {
    try {
      return await this.paymentService.createPayment(paymentData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create payment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body() paymentData: Partial<CreatePaymentDto>
  ): Promise<Payment> {
    try {
      return await this.paymentService.updatePayment(id, paymentData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update payment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.paymentService.deletePayment(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete payment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 