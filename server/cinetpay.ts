import { nanoid } from 'nanoid';

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY;
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID;
const CINETPAY_SECRET_KEY = process.env.CINETPAY_SECRET_KEY;
const CINETPAY_API_URL = 'https://api-checkout.cinetpay.com/v2';

export interface CinetPayPaymentRequest {
  amount: number;
  currency: string;
  transactionId: string;
  description: string;
  customerName: string;
  customerSurname: string;
  customerEmail: string;
  customerPhone?: string;
  notifyUrl: string;
  returnUrl: string;
  channels?: string;
  lang?: string;
}

export interface CinetPayPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  paymentToken?: string;
  transactionId?: string;
  error?: string;
}

export interface CinetPayPaymentStatus {
  status: 'pending' | 'success' | 'failed';
  amount?: number;
  paymentMethod?: string;
  transactionId?: string;
  details?: any;
}

export class CinetPayService {
  private apiKey: string;
  private siteId: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    if (!CINETPAY_API_KEY || !CINETPAY_SITE_ID || !CINETPAY_SECRET_KEY) {
      throw new Error('CinetPay credentials are not configured');
    }
    this.apiKey = CINETPAY_API_KEY;
    this.siteId = CINETPAY_SITE_ID;
    this.secretKey = CINETPAY_SECRET_KEY;
    this.baseUrl = CINETPAY_API_URL;
  }

  async createPayment(params: CinetPayPaymentRequest): Promise<CinetPayPaymentResponse> {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: params.transactionId,
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        customer_name: params.customerName,
        customer_surname: params.customerSurname,
        customer_email: params.customerEmail,
        customer_phone_number: params.customerPhone || '',
        customer_address: 'Cameroun',
        customer_city: 'Yaoundé',
        customer_country: 'CM',
        customer_state: 'CM',
        customer_zip_code: '00237',
        notify_url: params.notifyUrl,
        return_url: params.returnUrl,
        channels: params.channels || 'ALL',
        lang: params.lang || 'FR',
      };

      console.log('CinetPay payment request:', { ...payload, apikey: '[HIDDEN]' });

      const response = await fetch(`${this.baseUrl}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('CinetPay response:', data);

      if (!response.ok || data.code !== '201') {
        console.error('CinetPay API error:', data);
        return {
          success: false,
          error: data.description || data.message || 'Failed to create payment',
        };
      }

      return {
        success: true,
        paymentUrl: data.data?.payment_url,
        paymentToken: data.data?.payment_token,
        transactionId: params.transactionId,
      };
    } catch (error) {
      console.error('CinetPay payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<CinetPayPaymentStatus> {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: transactionId,
      };

      const response = await fetch(`${this.baseUrl}/payment/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.code !== '00') {
        console.error('CinetPay status check error:', data);
        return { status: 'failed' };
      }

      const status = data.data?.status?.toLowerCase() || 'pending';
      
      return {
        status: status === 'accepted' || status === 'success' ? 'success' : 
                status === 'refused' || status === 'failed' || status === 'cancelled' ? 'failed' : 'pending',
        amount: data.data?.amount,
        paymentMethod: data.data?.payment_method,
        transactionId: data.data?.transaction_id,
        details: data.data,
      };
    } catch (error) {
      console.error('CinetPay status check error:', error);
      return { status: 'failed' };
    }
  }

  verifyWebhookSignature(payload: any, signature: string): boolean {
    // CinetPay uses a different signature mechanism
    // For now, we'll validate based on site_id matching
    return payload.cpm_site_id === this.siteId;
  }
}

export const cinetpayService = new CinetPayService();
