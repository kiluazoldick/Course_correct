import { nanoid } from 'nanoid';

const LYGOS_API_KEY = process.env.LYGOS_API_KEY;
const LYGOS_API_URL = 'https://api.lygosapp.com/v1';

export interface LygosPaymentRequest {
  title: string;
  amount: number;
  description: string;
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
      const orderId = params.orderId || nanoid();
      
      const payload = {
        title: params.title,
        amount: params.amount,
        description: params.description,
        'success-url': params.successUrl,
        'failure-url': params.failureUrl,
      };

      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Lygos API error:', data);
        return {
          success: false,
          error: data.message || 'Failed to create payment',
        };
      }

      return {
        success: true,
        checkoutUrl: data.checkoutUrl || data.checkout_url || data.url,
        productId: data.productId || data.product_id || data.id,
        orderId,
      };
    } catch (error) {
      console.error('Lygos payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentStatus(orderId: string): Promise<LygosPaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/status/${orderId}`, {
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
        status: status === 'success' || status === 'completed' ? 'success' : 
                status === 'failed' ? 'failed' : 'pending',
        amount: data.amount,
        paymentMethod: data.payment_method || data.paymentMethod,
        transactionId: data.transaction_id || data.transactionId,
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
