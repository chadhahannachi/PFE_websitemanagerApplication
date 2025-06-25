import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly laravelApiUrl= 'http://127.0.0.1:8000';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.httpService.axiosRef.defaults.family = 4; // Force IPv4
  }

  async getAllPayments() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.laravelApiUrl}/api/payments`, {
          headers: {
            'Accept': 'application/json',
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error getting all payments: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to retrieve all payments: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error getting all payments: ${error.message}`);
      throw new Error(`Erreur lors de la récupération des paiements: ${error.message}`);
    }
  }

  async getPaymentById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.laravelApiUrl}/api/payments/${id}`, {
          headers: {
            'Accept': 'application/json',
          }
        })
      );
      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error getting payment by id ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to retrieve payment ${id}: ${error.response?.data?.message || error.message}`);
      } else {
        this.logger.error(`Unexpected error getting payment by id ${id}: ${error.message || error}`, error);
        throw new Error(`Erreur inattendue lors de la récupération du paiement: ${error.message || error}`);
      }
    }
  }

  async createPayment(paymentData: {
    licence_id: string;
    amount: number;
    payment_method: string;
    currency: string;
    notes?: string;
  }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.laravelApiUrl}/payments`, paymentData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error creating payment: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data,
          }
        });
        throw new Error(`Failed to create payment: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error creating payment: ${error.message}`);
      throw new Error(`Erreur lors de la création du paiement: ${error.message}`);
    }
  }

  async updatePayment(id: string, updateData: {
    status?: string;
    notes?: string;
  }) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.laravelApiUrl}/api/payments/${id}`, updateData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error updating payment ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data,
          }
        });
        throw new Error(`Failed to update payment: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error updating payment: ${error.message}`);
      throw new Error(`Erreur lors de la mise à jour du paiement: ${error.message}`);
    }
  }

  async deletePayment(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.laravelApiUrl}/api/payments/${id}`, {
          headers: {
            'Accept': 'application/json',
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error deleting payment ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to delete payment: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error deleting payment: ${error.message}`);
      throw new Error(`Erreur lors de la suppression du paiement: ${error.message}`);
    }
  }

  async getLicencePayments(licenceId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.laravelApiUrl}/api/payments/licence/${licenceId}`, {
          headers: {
            'Accept': 'application/json',
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error getting licence payments ${licenceId}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        throw new Error(`Failed to retrieve licence payments: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error getting licence payments: ${error.message}`);
      throw new Error(`Erreur lors de la récupération des paiements de la licence: ${error.message}`);
    }
  }

  async updatePaymentStatus(id: string, status: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.laravelApiUrl}/api/payments/${id}/status`, { status }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Axios error updating payment status ${id}: ${error.message}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data,
          }
        });
        throw new Error(`Failed to update payment status: ${error.response?.data?.message || error.message}`);
      }
      this.logger.error(`Error updating payment status: ${error.message}`);
      throw new Error(`Erreur lors de la mise à jour du statut du paiement: ${error.message}`);
    }
  }
} 