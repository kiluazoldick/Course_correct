import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Heart, Target, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Notre mission",
      description: "Rendre l'apprentissage plus efficace et accessible à tous les étudiants grâce à la technologie."
    },
    {
      icon: Heart,
      title: "Notre passion",
      description: "Aider les étudiants à réussir en leur fournissant des outils simples qui facilitent la compréhension."
    },
    {
      icon: Zap,
      title: "Notre approche",
      description: "Des outils intelligents qui s'adaptent à votre rythme pour des révisions plus efficaces."
    },
    {
      icon: Users,
      title: "Notre communauté",
      description: "Des milliers d'étudiants nous font confiance pour améliorer leurs résultats académiques."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 via-background to-background py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
              À propos de Corrige Tes Cours
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nous croyons que chaque étudiant mérite les meilleurs outils pour réussir ses études
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Notre histoire</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Corrige Tes Cours est né d'un constat simple : les étudiants passent trop de temps 
                à réviser sans vraiment progresser.
              </p>
              <p className="text-lg text-muted-foreground">
                Nous avons créé une plateforme qui permet d'apprendre plus efficacement 
                et d'obtenir de meilleurs résultats en moins de temps.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-value-${index}`}>
                  <CardContent className="p-6">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Notre engagement</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nous travaillons chaque jour pour améliorer notre plateforme et vous offrir 
              la meilleure expérience d'apprentissage possible. Votre réussite est notre priorité.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Rejoignez des milliers d'étudiants qui réussissent
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Commencez dès aujourd'hui et transformez votre façon d'apprendre
            </p>
            <Link href="/signup">
              <Button size="lg" data-testid="button-signup-cta">
                Créer un compte gratuit
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
