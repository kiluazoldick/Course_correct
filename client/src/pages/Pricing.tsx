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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" data-testid="link-home" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2">
              <span className="text-lg font-semibold">Corrige Tes Cours</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/features">
                <Button variant="ghost" data-testid="button-features">Fonctionnalités</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" data-testid="button-about">À propos</Button>
              </Link>
              <Link href="/login">
                <Button variant="default" data-testid="button-login">Connexion</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary/90 to-primary/70">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choisissez le plan qui vous correspond
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Commencez gratuitement, évoluez quand vous êtes prêt. 
              Tous les plans incluent une garantie satisfait ou remboursé.
            </p>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative hover-elevate ${plan.popular ? 'border-primary shadow-lg' : ''}`}
                  data-testid={`card-plan-${index}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white" data-testid="badge-popular">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Le plus populaire
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-8">
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
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
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

            <div className="mt-16 text-center">
              <h3 className="text-2xl font-semibold mb-4">Questions fréquentes</h3>
              <div className="max-w-3xl mx-auto space-y-6 text-left">
                <div>
                  <h4 className="font-semibold mb-2">Puis-je changer de plan à tout moment ?</h4>
                  <p className="text-muted-foreground">
                    Oui, vous pouvez passer d'un plan à l'autre à tout moment. 
                    Le changement est immédiat et vous ne payez que la différence au prorata.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Comment fonctionne la période d'essai ?</h4>
                  <p className="text-muted-foreground">
                    Vous pouvez tester les plans payants sans engagement. 
                    Annulez avant la fin de la période d'essai et vous ne serez pas facturé.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quels modes de paiement acceptez-vous ?</h4>
                  <p className="text-muted-foreground">
                    Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) 
                    et les paiements via PayPal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Corrige Tes Cours. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
