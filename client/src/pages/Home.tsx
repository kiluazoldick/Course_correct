import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { Brain, FileText, TrendingUp, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: 'Prise de notes',
      description: 'Organisez vos cours efficacement avec notre éditeur intuitif',
    },
    {
      icon: Brain,
      title: 'Résumés IA',
      description: 'DeepSeek R1 génère des résumés clairs et structurés',
    },
    {
      icon: Sparkles,
      title: 'Quiz intelligents',
      description: 'Quiz personnalisés adaptés à votre niveau et vos besoins',
    },
    {
      icon: TrendingUp,
      title: 'Suivi de progrès',
      description: 'Visualisez votre évolution avec des statistiques détaillées',
    },
  ];

  const benefits = [
    'Gain de temps considérable dans vos révisions',
    'Meilleure compréhension des cours',
    'Révisions ciblées et efficaces',
    'Progression mesurable',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
                Réussissez vos études avec{' '}
                <span className="text-primary">l'intelligence artificielle</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
                Corrige Tes Cours utilise DeepSeek R1 pour transformer vos notes en résumés structurés 
                et générer des quiz personnalisés.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <Button size="lg" className="gap-2 group" data-testid="button-hero-cta">
                    Commencer gratuitement
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg" data-testid="button-hero-features">
                    Découvrir les fonctionnalités
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
                Tout ce dont vous avez besoin pour réussir
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des outils puissants conçus pour les étudiants ambitieux
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate border-border" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-benefits-title">
                  Pourquoi choisir Corrige Tes Cours ?
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`text-benefit-${index}`}>
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">IA DeepSeek R1</p>
                          <p className="text-sm text-muted-foreground">Modèle de raisonnement avancé</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Notre plateforme utilise DeepSeek R1, le modèle d'IA le plus performant 
                        pour la compréhension et l'analyse de contenu académique.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
              Prêt à transformer votre façon d'étudier ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez les étudiants qui réussissent grâce à Corrige Tes Cours
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2 group" data-testid="button-cta-signup">
                Créer un compte gratuit
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
