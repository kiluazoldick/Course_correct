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
      description: "Plus de 1000+ étudiants nous font confiance pour améliorer leurs résultats académiques et gagner du temps."
    }
  ];

  const team = [
    {
      name: "Équipe dédiée",
      role: "Développement & Support",
      description: "Notre équipe travaille chaque jour pour améliorer la plateforme et vous offrir la meilleure expérience d'apprentissage."
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
              <Link href="/pricing">
                <Button variant="ghost" data-testid="button-pricing">Tarifs</Button>
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
              À propos de Corrige Tes Cours
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Nous croyons que chaque étudiant mérite les meilleurs outils pour réussir ses études. 
              C'est pourquoi nous avons créé Corrige Tes Cours.
            </p>
          </div>
        </section>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {values.map((value, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-value-${index}`}>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">L'équipe</h2>
            <div className="max-w-2xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-team-${index}`}>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

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

      <footer className="bg-secondary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">Email: contact@corrigetescours.fr</p>
              <p className="text-sm text-muted-foreground">Support: support@corrigetescours.fr</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Tarifs</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <p className="text-sm text-muted-foreground">Restez informé de nos dernières actualités sur les réseaux sociaux.</p>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2025 Corrige Tes Cours. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
