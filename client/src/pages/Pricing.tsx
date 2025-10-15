import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Pricing() {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "toujours",
      description: "Parfait pour découvrir la plateforme",
      features: [
        "5 cours maximum",
        "10 résumés IA par mois",
        "15 quiz par mois",
        "Statistiques de base",
        "Support par email"
      ],
      cta: "Commencer gratuitement",
      popular: false
    },
    {
      name: "Étudiant",
      price: "9.90€",
      period: "par mois",
      description: "L'essentiel pour réussir vos études",
      features: [
        "Cours illimités",
        "Résumés IA illimités",
        "Quiz illimités",
        "Téléchargement PDF",
        "Statistiques avancées",
        "Graphiques de progression",
        "Support prioritaire",
        "Accès anticipé aux nouvelles fonctionnalités"
      ],
      cta: "Essayer 7 jours gratuits",
      popular: true
    },
    {
      name: "Universitaire",
      price: "15.90€",
      period: "par mois",
      description: "Pour les étudiants les plus exigeants",
      features: [
        "Tout du plan Étudiant",
        "IA plus puissante (DeepSeek R1 Premium)",
        "Analyses approfondies",
        "Export multi-formats (PDF, Markdown, DOCX)",
        "Partage de notes avec collaborateurs",
        "Révisions personnalisées IA",
        "Support téléphonique",
        "Garantie de satisfaction 30 jours"
      ],
      cta: "Essayer 14 jours gratuits",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 via-background to-background py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-pricing-title">
              Choisissez le plan qui vous correspond
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Commencez gratuitement, évoluez quand vous êtes prêt. 
              Tous les plans incluent une garantie satisfait ou remboursé.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative hover-elevate ${plan.popular ? 'border-primary' : ''}`}
                  data-testid={`card-plan-${index}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary" data-testid="badge-popular">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Le plus populaire
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup">
                      <Button 
                        variant={plan.popular ? "default" : "outline"}
                        className="w-full"
                        size="lg"
                        data-testid={`button-select-plan-${index}`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ */}
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold mb-12">Questions fréquentes</h2>
              <div className="max-w-3xl mx-auto grid gap-8 text-left">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Puis-je changer de plan à tout moment ?</h3>
                    <p className="text-sm text-muted-foreground">
                      Oui, vous pouvez passer d'un plan à l'autre à tout moment. 
                      Le changement est immédiat et vous ne payez que la différence au prorata.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Comment fonctionne la période d'essai ?</h3>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez tester les plans payants sans engagement. 
                      Annulez avant la fin de la période d'essai et vous ne serez pas facturé.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Quels modes de paiement acceptez-vous ?</h3>
                    <p className="text-sm text-muted-foreground">
                      Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) 
                      et les paiements via PayPal.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
