import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getErrorMessage } from '@/lib/errorHandler';

interface PaymentResponse {
  paymentId: string;
  checkoutUrl: string;
  sessionId: string;
}

export default function PaymentMethod() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/payment/stripe/checkout', {});
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
    },
  });

  const isLoading = checkoutMutation.isPending;

  const features = language === 'fr' 
    ? [
        "Cours illimités",
        "Résumés IA illimités",
        "Quiz illimités (10-15 questions)",
        "Tariq IA sans limites",
        "Flashcards IA illimitées",
        "Guides d'étude IA",
      ]
    : [
        "Unlimited courses",
        "Unlimited AI summaries",
        "Unlimited quizzes (10-15 questions)",
        "Unlimited Tariq AI",
        "Unlimited AI flashcards",
        "AI study guides",
      ];

  return (
    <div className="w-full py-8 px-6">
      <div className="max-w-lg mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/dashboard/subscription')}
          className="mb-4"
          data-testid="button-back-subscription"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'fr' ? 'Retour' : 'Back'}
        </Button>

        <Card data-testid="card-payment-checkout">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 bg-primary/10 rounded-full mb-2">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">
              {language === 'fr' ? 'Passer au Premium' : 'Upgrade to Premium'}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? 'Débloquez toutes les fonctionnalités' 
                : 'Unlock all features'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold" data-testid="text-price">
                $10 <span className="text-lg font-normal text-muted-foreground">/{language === 'fr' ? 'mois' : 'month'}</span>
              </div>
            </div>

            <div className="space-y-2">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              className="w-full"
              size="lg"
              disabled={isLoading}
              onClick={() => checkoutMutation.mutate()}
              data-testid="button-pay"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'fr' ? 'Redirection...' : 'Redirecting...'}
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Payer par carte' : 'Pay with card'}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              <span>
                {language === 'fr' 
                  ? 'Paiement sécurisé par Stripe' 
                  : 'Secure payment via Stripe'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
