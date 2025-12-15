import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Smartphone, CreditCard, ArrowLeft, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getErrorMessage } from '@/lib/errorHandler';

interface PaymentResponse {
  paymentId: string;
  checkoutUrl: string;
  transactionId: string;
}

export default function PaymentMethod() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<'mobile' | 'card' | null>(null);

  const mobileMoneyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/payment/initiate');
      return await res.json();
    },
    onSuccess: (data: PaymentResponse) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: language === 'fr' ? "Erreur" : "Error",
        description: getErrorMessage(error, language),
        variant: "destructive",
      });
      setSelectedMethod(null);
    },
  });

  const cardMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/payment/flutterwave/initiate', { currency: 'USD' });
      return await res.json();
    },
    onSuccess: (data: PaymentResponse) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: language === 'fr' ? "Erreur" : "Error",
        description: getErrorMessage(error, language),
        variant: "destructive",
      });
      setSelectedMethod(null);
    },
  });

  const handlePayment = (method: 'mobile' | 'card') => {
    setSelectedMethod(method);
    if (method === 'mobile') {
      mobileMoneyMutation.mutate();
    } else {
      cardMutation.mutate();
    }
  };

  const isLoading = mobileMoneyMutation.isPending || cardMutation.isPending;

  return (
    <div className="w-full py-8 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/dashboard/subscription')}
          className="mb-4"
          data-testid="button-back-subscription"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'fr' ? 'Retour' : 'Back'}
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-payment-title">
            {language === 'fr' ? 'Choisir une méthode de paiement' : 'Choose a payment method'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'fr' 
              ? 'Premium - 500 XAF / 1 USD par mois' 
              : 'Premium - 500 XAF / $1 USD per month'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card 
            className={`cursor-pointer transition-all hover-elevate ${selectedMethod === 'mobile' ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => !isLoading && handlePayment('mobile')}
            data-testid="card-payment-mobile"
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full mb-2">
                <Smartphone className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-lg">Mobile Money</CardTitle>
              <CardDescription>
                MTN MoMo, Orange Money
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">500 XAF</div>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'fr' ? 'Cameroun uniquement' : 'Cameroon only'}
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white"
                disabled={isLoading}
                data-testid="button-pay-mobile"
              >
                {selectedMethod === 'mobile' && isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'fr' ? 'Chargement...' : 'Loading...'}
                  </>
                ) : (
                  language === 'fr' ? 'Payer avec Mobile Money' : 'Pay with Mobile Money'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover-elevate ${selectedMethod === 'card' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => !isLoading && handlePayment('card')}
            data-testid="card-payment-card"
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full mb-2">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg">
                {language === 'fr' ? 'Carte Bancaire' : 'Credit Card'}
              </CardTitle>
              <CardDescription>
                Visa, Mastercard
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">$1 USD</div>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'fr' ? 'International' : 'International'}
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white"
                disabled={isLoading}
                data-testid="button-pay-card"
              >
                {selectedMethod === 'card' && isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'fr' ? 'Chargement...' : 'Loading...'}
                  </>
                ) : (
                  language === 'fr' ? 'Payer par Carte' : 'Pay with Card'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
          <Shield className="w-4 h-4" />
          <span>
            {language === 'fr' 
              ? 'Paiements sécurisés par Lygos et Flutterwave' 
              : 'Secure payments via Lygos and Flutterwave'}
          </span>
        </div>
      </div>
    </div>
  );
}
