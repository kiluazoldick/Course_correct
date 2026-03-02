import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, CreditCard, Sparkles, Zap } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { PremiumBadge, PremiumCard } from '@/components/PremiumBadge';

interface SubscriptionData {
  status: string;
  isPremium: boolean;
  endDate?: string;
  amount?: number;
  paymentMethod?: string;
}

export default function Subscription() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('success') === 'true') {
      toast({
        title: t.subscriptionPage.paymentSuccess,
        description: t.subscriptionPage.paymentSuccessDesc,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      window.history.replaceState({}, '', '/dashboard/subscription');
    } else if (params.get('error')) {
      const error = params.get('error');
      let errorMessage: string = t.subscriptionPage.paymentFailedDesc;
      
      if (error === 'payment_failed') {
        errorMessage = language === 'fr' 
          ? "Le paiement a été refusé. Vérifie tes informations et réessaye."
          : "Payment was declined. Check your information and try again.";
      } else if (error === 'payment_not_found') {
        errorMessage = language === 'fr' 
          ? "Transaction introuvable. Contacte le support."
          : "Transaction not found. Contact support.";
      } else if (error === 'server_error') {
        errorMessage = language === 'fr' 
          ? "Erreur serveur. Réessaye dans quelques instants."
          : "Server error. Try again in a moment.";
      }
      
      toast({
        title: t.subscriptionPage.paymentFailed,
        description: errorMessage,
        variant: "destructive",
      });
      window.history.replaceState({}, '', '/dashboard/subscription');
    } else if (params.get('pending') === 'true') {
      toast({
        title: t.subscriptionPage.paymentPending,
        description: t.subscriptionPage.paymentPendingDesc,
      });
      window.history.replaceState({}, '', '/dashboard/subscription');
    }
  }, [toast, t, language]);

  const { data: subscription, isLoading: subLoading } = useQuery<SubscriptionData>({
    queryKey: ['/api/subscription'],
  });

  if (subLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const isPremium = subscription?.isPremium;
  const endDate = subscription?.endDate ? new Date(subscription.endDate) : null;

  const freeFeatures = language === 'fr' 
    ? [
        { included: true, text: "2 cours maximum" },
        { included: true, text: "1 résumé IA par mois" },
        { included: true, text: "1 quiz par mois (5 questions)" },
        { included: true, text: "Tariq IA : 3 messages/session" },
        { included: false, text: "Flashcards IA" },
        { included: false, text: "Guides d'étude IA" },
      ]
    : [
        { included: true, text: "Up to 2 courses" },
        { included: true, text: "1 AI summary per month" },
        { included: true, text: "1 quiz per month (5 questions)" },
        { included: true, text: "Tariq AI: 3 messages/session" },
        { included: false, text: "AI Flashcards" },
        { included: false, text: "AI Study Guides" },
      ];

  const premiumFeatures = language === 'fr'
    ? [
        "Cours illimités",
        "Résumés IA illimités",
        "Quiz illimités (10-15 questions)",
        "Tariq IA : messages illimités",
        "Flashcards IA illimitées",
        "Guides d'étude IA",
        "Accès prioritaire aux nouvelles fonctionnalités",
      ]
    : [
        "Unlimited courses",
        "Unlimited AI summaries",
        "Unlimited quizzes (10-15 questions)",
        "Tariq AI: unlimited messages",
        "Unlimited AI flashcards",
        "AI study guides",
        "Priority access to new features",
      ];

  return (
    <div className="w-full py-8 px-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold" data-testid="text-subscription-title">{t.subscriptionPage.title}</h1>
        <p className="text-muted-foreground mt-2">
          {t.subscriptionPage.subtitle}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-current-plan">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>{t.subscriptionPage.currentPlan}</CardTitle>
              {isPremium ? (
                <PremiumBadge size="md" />
              ) : (
                <Badge variant="secondary" data-testid="badge-plan-status">
                  {t.subscriptionPage.free}
                </Badge>
              )}
            </div>
            <CardDescription>
              {isPremium
                ? (language === 'fr' ? "Tu profites de toutes les fonctionnalités Premium" : "You're enjoying all Premium features")
                : (language === 'fr' ? "Passe au Premium pour débloquer toutes les fonctionnalités" : "Upgrade to Premium to unlock all features")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPremium && endDate ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{t.subscriptionPage.expiresOn}</span>
                  <span className="font-medium" data-testid="text-expiry-date">
                    {format(endDate, 'dd MMMM yyyy', { locale: language === 'fr' ? fr : enUS })}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">{language === 'fr' ? 'Plan' : 'Plan'}</span>
                  <span className="font-medium">{language === 'fr' ? 'Premium actif' : 'Premium active'}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {freeFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {feat.included ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={feat.included ? '' : 'text-muted-foreground'}>{feat.text}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <PremiumCard className="p-0" data-testid="card-premium-features">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <CardTitle>{t.subscriptionPage.features.title}</CardTitle>
            </div>
            <CardDescription>
              {language === 'fr' ? 'Débloquez tout le potentiel de Corrige Tes Cours' : 'Unlock the full potential of Corrige Tes Cours'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {premiumFeatures.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="font-medium">{feat}</span>
              </div>
            ))}

            <div className="pt-4 mt-4 border-t">
              <div className="text-xl font-bold mb-2 text-primary" data-testid="text-price">
                {language === 'fr' ? 'Débloquez tout, sans limite' : 'Unlock everything, no limits'}
              </div>

              {!isPremium && (
                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-0 shadow-lg shadow-amber-500/25"
                  size="lg"
                  onClick={() => setLocation('/payment-method')}
                  data-testid="button-subscribe-premium"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {t.subscriptionPage.subscribe}
                </Button>
              )}
            </div>
          </CardContent>
        </PremiumCard>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card data-testid="card-payment-methods">
          <CardHeader>
            <CardTitle>{t.subscriptionPage.paymentMethods}</CardTitle>
            <CardDescription>
              {language === 'fr' ? 'Paiement sécurisé par carte bancaire' : 'Secure card payment'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-blue-500/10 rounded-md">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">{language === 'fr' ? 'Carte Bancaire' : 'Credit Card'}</div>
                <div className="text-xs text-muted-foreground">Visa, Mastercard</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                {language === 'fr' 
                  ? <>Tes paiements sont sécurisés par <span className="font-medium">Stripe</span>.</>
                  : <>Your payments are secured by <span className="font-medium">Stripe</span>.</>
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
