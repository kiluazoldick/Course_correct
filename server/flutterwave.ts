/**
 * Flutterwave Payment Integration Service
 * Handles payments via cards and Mobile Money (MTN, Orange) in Cameroon
 */

const FLW_BASE_URL = 'https://api.flutterwave.com/v3';

interface FlutterwavePaymentRequest {
  amount: number;
  currency: 'XAF' | 'USD';
  email: string;
  phone_number?: string;
  name: string;
  tx_ref: string;
  redirect_url: string;
  meta?: {
    userId: string;
    subscriptionType: string;
  };
}

interface FlutterwavePaymentResponse {
  status: string;
  message: string;
  data?: {
    link: string;
    id?: number;
  };
}

interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: string;
    payment_type: string;
    customer: {
      id: number;
      email: string;
      phone_number: string | null;
      name: string;
    };
    created_at: string;
  };
}

class FlutterwaveService {
  private secretKey: string;
  private publicKey: string;
  private encryptionKey: string;

  constructor() {
    this.secretKey = process.env.FLW_SECRET_KEY || '';
    this.publicKey = process.env.FLW_PUBLIC_KEY || '';
    this.encryptionKey = process.env.FLW_ENCRYPTION_KEY || '';

    if (!this.secretKey || !this.publicKey) {
      console.warn('Flutterwave API keys not configured');
    }
  }

  /**
   * Initialize a payment using Flutterwave Standard (hosted payment page)
   * Supports cards and mobile money automatically
   */
  async initializePayment(params: FlutterwavePaymentRequest): Promise<FlutterwavePaymentResponse> {
    const payload = {
      tx_ref: params.tx_ref,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirect_url,
      customer: {
        email: params.email,
        phonenumber: params.phone_number || '',
        name: params.name,
      },
      customizations: {
        title: 'Corrige Tes Cours Premium',
        description: 'Abonnement Premium mensuel',
        logo: 'https://corrigetescours.com/logo.png',
      },
      payment_options: params.currency === 'XAF' 
        ? 'card,mobilemoneycameroon' 
        : 'card',
      meta: params.meta,
    };

    try {
      const response = await fetch(`${FLW_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.data?.link) {
        return {
          status: 'success',
          message: 'Payment initialized',
          data: {
            link: data.data.link,
          },
        };
      }

      console.error('Flutterwave payment init failed:', data);
      return {
        status: 'error',
        message: data.message || 'Failed to initialize payment',
      };
    } catch (error) {
      console.error('Flutterwave API error:', error);
      return {
        status: 'error',
        message: 'Network error connecting to Flutterwave',
      };
    }
  }

  /**
   * Verify a transaction by ID or tx_ref
   */
  async verifyTransaction(transactionId: string | number): Promise<FlutterwaveVerifyResponse> {
    try {
      const response = await fetch(`${FLW_BASE_URL}/transactions/${transactionId}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Flutterwave verify error:', error);
      return {
        status: 'error',
        message: 'Failed to verify transaction',
      };
    }
  }

  /**
   * Verify transaction by tx_ref (our reference)
   */
  async verifyByTxRef(txRef: string): Promise<FlutterwaveVerifyResponse> {
    try {
      const response = await fetch(`${FLW_BASE_URL}/transactions?tx_ref=${txRef}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.data && data.data.length > 0) {
        const transaction = data.data[0];
        return {
          status: 'success',
          message: 'Transaction found',
          data: transaction,
        };
      }

      return {
        status: 'error',
        message: 'Transaction not found',
      };
    } catch (error) {
      console.error('Flutterwave verify by ref error:', error);
      return {
        status: 'error',
        message: 'Failed to verify transaction',
      };
    }
  }

  /**
   * Validate webhook signature (for security)
   */
  validateWebhookSignature(payload: any, signature: string): boolean {
    // Flutterwave sends the secret hash in verif-hash header
    // We compare it with our secret hash
    const secretHash = process.env.FLW_SECRET_HASH || this.secretKey;
    return signature === secretHash;
  }

  /**
   * Generate unique transaction reference
   */
  generateTxRef(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `CTC-${userId}-${timestamp}-${random}`;
  }

  /**
   * Get payment methods for a currency
   */
  getPaymentMethods(currency: 'XAF' | 'USD'): string[] {
    if (currency === 'XAF') {
      return ['MTN Mobile Money', 'Orange Money', 'Visa/Mastercard'];
    }
    return ['Visa', 'Mastercard', 'American Express'];
  }

  /**
   * Convert amount between currencies (approximate)
   * 1 USD ≈ 600 XAF
   */
  convertToXAF(usdAmount: number): number {
    return Math.round(usdAmount * 600);
  }

  convertToUSD(xafAmount: number): number {
    return Math.round((xafAmount / 600) * 100) / 100;
  }
}

export const flutterwaveService = new FlutterwaveService();
