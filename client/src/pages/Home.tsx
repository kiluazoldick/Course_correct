import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Brain, TrendingUp, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "Résumés Intelligents",
      description: "Des résumés clairs et structurés de vos cours en quelques secondes"
    },
    {
      icon: BookOpen,
      title: "Quiz Personnalisés",
      description: "Testez vos connaissances avec des questions adaptées à votre niveau"
    },
    {
      icon: TrendingUp,
      title: "Suivi de Progression",
      description: "Visualisez vos progrès et identifiez vos points à améliorer"
    },
    {
      icon: Award,
      title: "Résultats Garantis",
      description: "Améliorez vos notes et réussissez vos examens avec confiance"
    }
  ];

  const benefits = [
    "Gagnez des heures de révision chaque semaine",
    "Comprenez mieux vos cours grâce aux résumés clairs",
    "Révisez de manière efficace avec des quiz ciblés",
    "Suivez vos progrès et atteignez vos objectifs"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 via-background to-background py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
              Réussissez vos études avec l'IA
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transformez vos cours en résumés clairs et testez vos connaissances avec des quiz intelligents
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8" data-testid="button-cta-signup">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-cta-features">
                  Découvrir les fonctionnalités
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tout ce dont vous avez besoin pour réussir
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des outils puissants mais simples à utiliser pour optimiser vos révisions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Pourquoi choisir Corrige Tes Cours ?
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <Card className="p-8 max-w-md">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">+90%</div>
                    <p className="text-muted-foreground">de nos étudiants améliorent leurs notes</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à améliorer vos résultats ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez des milliers d'étudiants qui réussissent avec Corrige Tes Cours
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8" data-testid="button-final-cta">
                Créer mon compte gratuit
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
