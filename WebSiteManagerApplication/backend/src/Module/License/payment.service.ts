import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { Payment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly baseUrl = 'http://127.0.0.1:8000/api';

  async getAllPayments(): Promise<Payment[]> {
    try {
      this.logger.debug('Fetching all payments...');
      const response = await axios.get(`${this.baseUrl}/payments`);
      this.logger.debug(`Received ${response.data.length} payments`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Failed to fetch payments: ${error.message}`);
        this.logger.error(`Status: ${error.response?.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  }

  async getPayment(id: string): Promise<Payment> {
    try {
      this.logger.debug(`Fetching payment with ID: ${id}`);
      const response = await axios.get(`${this.baseUrl}/payments/${id}`);
      this.logger.debug(`Received payment: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Failed to fetch payment: ${error.message}`);
        this.logger.error(`Status: ${error.response?.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  }

  async createPayment(paymentData: CreatePaymentDto): Promise<Payment> {
    try {
      this.logger.debug(`Creating payment with data: ${JSON.stringify(paymentData)}`);
      const response = await axios.post(`${this.baseUrl}/payments`, paymentData);
      this.logger.debug(`Created payment: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Failed to create payment: ${error.message}`);
        this.logger.error(`Status: ${error.response?.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  }

  async updatePayment(id: string, paymentData: Partial<CreatePaymentDto>): Promise<Payment> {
    try {
      this.logger.debug(`Updating payment ${id} with data: ${JSON.stringify(paymentData)}`);
      const response = await axios.put(`${this.baseUrl}/payments/${id}`, paymentData);
      this.logger.debug(`Updated payment: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Failed to update payment: ${error.message}`);
        this.logger.error(`Status: ${error.response?.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  }

  async deletePayment(id: string): Promise<{ message: string }> {
    try {
      this.logger.debug(`Deleting payment with ID: ${id}`);
      const response = await axios.delete(`${this.baseUrl}/payments/${id}`);
      this.logger.debug(`Deleted payment: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Failed to delete payment: ${error.message}`);
        this.logger.error(`Status: ${error.response?.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  }
} 