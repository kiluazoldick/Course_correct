import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Crown, Smartphone, CreditCard } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SubscriptionData {
  status: string;
  isPremium: boolean;
  endDate?: string;
  amount?: number;
  paymentMethod?: string;
}

interface PaymentResponse {
  paymentId: string;
  checkoutUrl: string;
  transactionId: string;
}

interface PaymentStatusData {
  status: 'pending' | 'completed' | 'failed';
  payment?: any;
  subscription?: any;
}

export default function Subscription() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Check URL params for payment result (from return URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('success') === 'true') {
      toast({
        title: "Paiement réussi ! 🎉",
        description: "Ton abonnement Premium est maintenant actif",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      // Clean URL
      window.history.replaceState({}, '', '/dashboard/subscription');
    } else if (params.get('error')) {
      const error = params.get('error');
      let errorMessage = "Le paiement n'a pas été complété. Réessaye.";
      
      if (error === 'payment_failed') {
        errorMessage = "Le paiement a été refusé. Vérifie tes informations et réessaye.";
      } else if (error === 'payment_not_found') {
        errorMessage = "Transaction introuvable. Contacte le support.";
      } else if (error === 'server_error') {
        errorMessage = "Erreur serveur. Réessaye dans quelques instants.";
      }
      
      toast({
        title: "Paiement échoué",
        description: errorMessage,
        variant: "destructive",
      });
      // Clean URL
      window.history.replaceState({}, '', '/dashboard/subscription');
    } else if (params.get('pending') === 'true') {
      toast({
        title: "Paiement en attente",
        description: "Ton paiement est en cours de traitement. Nous te confirmerons dès validation.",
      });
      // Clean URL
      window.history.replaceState({}, '', '/dashboard/subscription');
    }
  }, [toast]);

  const { data: subscription, isLoading: subLoading } = useQuery<SubscriptionData>({
    queryKey: ['/api/subscription'],
  });

  const { data: paymentStatus, isLoading: statusLoading } = useQuery<PaymentStatusData>({
    queryKey: ['/api/payment/status', paymentId],
    enabled: !!paymentId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || data.status === 'pending') return 3000;
      return false;
    },
  });

  const initiateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/payment/initiate');
      return await res.json();
    },
    onSuccess: (data: PaymentResponse) => {
      setPaymentId(data.paymentId);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'initier le paiement",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (paymentStatus?.status === 'completed') {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      toast({
        title: "Paiement réussi ! 🎉",
        description: "Ton abonnement Premium est maintenant actif",
      });
      setPaymentId(null);
    } else if (paymentStatus?.status === 'failed') {
      toast({
        title: "Paiement échoué",
        description: "Le paiement n'a pas été complété. Réessaye.",
        variant: "destructive",
      });
      setPaymentId(null);
    }
  }, [paymentStatus, toast]);

  if (subLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const isPremium = subscription?.isPremium;
  const endDate = subscription?.endDate ? new Date(subscription.endDate) : null;

  return (
    <div className="w-full py-8 px-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold" data-testid="text-subscription-title">Mon Abonnement</h1>
        <p className="text-muted-foreground mt-2">
          Gère ton abonnement et accède aux fonctionnalités Premium
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-current-plan">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Plan actuel</CardTitle>
              <Badge variant={isPremium ? "default" : "secondary"} data-testid="badge-plan-status">
                {isPremium ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </>
                ) : (
                  "Gratuit"
                )}
              </Badge>
            </div>
            <CardDescription>
              {isPremium
                ? "Tu profites de toutes les fonctionnalités Premium"
                : "Passe au Premium pour débloquer toutes les fonctionnalités"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPremium && endDate ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date d'expiration</span>
                  <span className="font-medium" data-testid="text-expiry-date">
                    {format(endDate, 'dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-medium">1 500 XAF/mois</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Saisir ses cours (illimité)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Résumés IA (illimités)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Téléchargement PDF des résumés</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Quiz personnalisés (illimités)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4" />
                  <span>Upload : 2 fichiers/mois (10MB max)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4" />
                  <span>Tariq IA : 5 messages/session (3h cooldown)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-premium-features">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <CardTitle>Fonctionnalités Premium</CardTitle>
            </div>
            <CardDescription>
              Débloquez tout le potentiel de Corrige Tes Cours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-medium">Tout du plan Gratuit</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-medium">Upload de fichiers illimité</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-medium">Tariq IA illimité (pas de limite)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-medium">Pas de cooldown</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-medium">Statistiques avancées</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-medium">Support prioritaire</span>
            </div>

            <div className="pt-4 mt-4 border-t">
              <div className="text-3xl font-bold mb-2" data-testid="text-price">
                1 500 <span className="text-lg font-normal text-muted-foreground">XAF/mois</span>
              </div>

              {!isPremium && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => initiateMutation.mutate()}
                  disabled={initiateMutation.isPending || !!paymentId}
                  data-testid="button-subscribe-premium"
                >
                  {initiateMutation.isPending || (paymentId && statusLoading) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {paymentId ? "Vérification du paiement..." : "Initialisation..."}
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Passer au Premium
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card data-testid="card-payment-methods">
          <CardHeader>
            <CardTitle>Moyens de paiement</CardTitle>
            <CardDescription>
              Paye facilement avec Mobile Money ou carte bancaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-yellow-500/10 rounded-md">
                <Smartphone className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium text-sm">MTN Mobile Money</div>
                <div className="text-xs text-muted-foreground">Cameroun</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-orange-500/10 rounded-md">
                <Smartphone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Orange Money</div>
                <div className="text-xs text-muted-foreground">Cameroun</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-md">
              <div className="p-2 bg-blue-500/10 rounded-md">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Carte bancaire</div>
                <div className="text-xs text-muted-foreground">Visa, Mastercard</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">
              Tes paiements sont sécurisés par <span className="font-medium">Lygos</span>, 
              la solution de paiement de confiance en Afrique.
            </p>
          </div>
        </CardContent>
        </Card>
      </div>

      {paymentId && (
        <div className="max-w-7xl mx-auto">
          <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20" data-testid="card-payment-pending">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Paiement en cours
            </CardTitle>
            <CardDescription>
              Nous attendons la confirmation de ton paiement...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Si tu as fermé la fenêtre de paiement, tu peux la rouvrir ou attendre 
              que nous détections automatiquement ton paiement.
            </p>
          </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
