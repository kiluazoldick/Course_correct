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
      description: "Rendre l'apprentissage plus efficace et accessible à tous les étudiants francophones grâce à l'intelligence artificielle."
    },
    {
      icon: Heart,
      title: "Notre passion",
      description: "Aider les étudiants à réussir en leur fournissant des outils innovants qui facilitent la compréhension et la mémorisation."
    },
    {
      icon: Zap,
      title: "Notre technologie",
      description: "Nous utilisons DeepSeek R1, le modèle d'IA de raisonnement le plus avancé, pour analyser et synthétiser vos cours."
    },
    {
      icon: Users,
      title: "Notre communauté",
      description: "Des milliers d'étudiants nous font confiance pour améliorer leurs résultats académiques et gagner du temps."
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
              Nous croyons que chaque étudiant mérite les meilleurs outils pour réussir ses études. 
              C'est pourquoi nous avons créé Corrige Tes Cours.
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
                à réviser de manière inefficace. Nous avons voulu changer cela.
              </p>
              <p className="text-lg text-muted-foreground">
                En combinant les dernières avancées en intelligence artificielle avec une interface 
                intuitive, nous avons créé un outil qui transforme vraiment la façon d'apprendre.
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Notre équipe travaille chaque jour pour améliorer la plateforme et vous offrir 
              la meilleure expérience d'apprentissage possible. Votre réussite est notre priorité.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Rejoignez la révolution de l'apprentissage
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Des milliers d'étudiants utilisent déjà Corrige Tes Cours pour améliorer leurs résultats. 
              Pourquoi pas vous ?
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
