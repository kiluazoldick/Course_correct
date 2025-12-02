import { nanoid } from 'nanoid';

const LYGOS_API_KEY = process.env.LYGOS_API_KEY;
const LYGOS_API_URL = 'https://api.lygosapp.com/v1';

export interface LygosPaymentRequest {
  shopName: string;
  amount: number;
  message: string;
  successUrl: string;
  failureUrl: string;
  orderId?: string;
}

export interface LygosPaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  productId?: string;
  orderId?: string;
  error?: string;
}

export interface LygosPaymentStatus {
  status: 'pending' | 'success' | 'failed';
  amount?: number;
  paymentMethod?: string;
  transactionId?: string;
  details?: any;
}

export class LygosService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    if (!LYGOS_API_KEY) {
      throw new Error('LYGOS_API_KEY is not configured');
    }
    this.apiKey = LYGOS_API_KEY;
    this.baseUrl = LYGOS_API_URL;
  }

  async createPayment(params: LygosPaymentRequest): Promise<LygosPaymentResponse> {
    try {
      const orderId = params.orderId || `CTC-${Date.now()}-${nanoid(8)}`;
      
      const payload = {
        amount: params.amount,
        shop_name: params.shopName,
        message: params.message,
        order_id: orderId,
        success_url: params.successUrl,
        failure_url: params.failureUrl,
      };

      console.log('=== Lygos Payment Request ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${this.baseUrl}/gateway`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      console.log('=== Lygos Payment Response ===');
      console.log('Status:', response.status);
      console.log('Data:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('Lygos API error:', data);
        return {
          success: false,
          error: data.detail || data.message || 'Failed to create payment',
        };
      }

      return {
        success: true,
        checkoutUrl: data.link,
        productId: data.id,
        orderId: orderId,
      };
    } catch (error) {
      console.error('Lygos payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentStatus(gatewayId: string): Promise<LygosPaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/gateway/${gatewayId}`, {
        method: 'GET',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Lygos status check error:', data);
        return { status: 'failed' };
      }

      const status = data.status?.toLowerCase() || 'pending';
      
      return {
        status: status === 'success' || status === 'completed' || status === 'paid' ? 'success' : 
                status === 'failed' || status === 'cancelled' ? 'failed' : 'pending',
        amount: data.amount,
        paymentMethod: data.payment_method || data.paymentMethod,
        transactionId: data.id || data.transaction_id,
        details: data,
      };
    } catch (error) {
      console.error('Lygos status check error:', error);
      return { status: 'failed' };
    }
  }

  async listPayments(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'GET',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Lygos list payments error:', data);
        return [];
      }

      return data.payments || data || [];
    } catch (error) {
      console.error('Lygos list payments error:', error);
      return [];
    }
  }
}

export const lygosService = new LygosService();
