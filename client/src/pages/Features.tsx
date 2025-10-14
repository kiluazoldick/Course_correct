import { FileText, Brain, CheckCircle, TrendingUp, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';

export default function Features() {
  const features = [
    {
      icon: FileText,
      title: "Prise de notes intelligente",
      description: "Créez et organisez vos cours en un seul endroit. Système de catégorisation par matière pour retrouver vos notes facilement.",
      details: [
        "Éditeur de texte riche et intuitif",
        "Organisation par matières et thèmes",
        "Recherche instantanée dans vos notes",
        "Stockage sécurisé de tous vos cours"
      ]
    },
    {
      icon: Brain,
      title: "Résumés IA avec DeepSeek R1",
      description: "Notre IA analyse vos cours et génère des résumés structurés avec les points clés, utilisant le modèle de raisonnement DeepSeek R1.",
      details: [
        "Génération automatique de résumés clairs",
        "Identification des concepts importants",
        "Format markdown structuré et lisible",
        "Téléchargement PDF pour révisions offline"
      ]
    },
    {
      icon: CheckCircle,
      title: "Quiz personnalisés",
      description: "L'IA crée des quiz adaptés à vos cours : QCM, questions ouvertes ou format mixte selon vos besoins.",
      details: [
        "QCM avec plusieurs choix de réponses",
        "Questions ouvertes pour approfondir",
        "Format mixte pour varier l'apprentissage",
        "Correction automatique instantanée"
      ]
    },
    {
      icon: Sparkles,
      title: "Évaluation automatique",
      description: "L'IA évalue vos réponses aux questions ouvertes et vous fournit un feedback détaillé pour progresser.",
      details: [
        "Correction intelligente des réponses ouvertes",
        "Feedback constructif et personnalisé",
        "Suggestions d'amélioration",
        "Score de compréhension détaillé"
      ]
    },
    {
      icon: TrendingUp,
      title: "Suivi de performance",
      description: "Visualisez votre progression avec des statistiques détaillées et des graphiques intuitifs.",
      details: [
        "Dashboard avec métriques clés",
        "Graphiques de progression dans le temps",
        "Analyse par matière",
        "Identification des points à améliorer"
      ]
    },
    {
      icon: Target,
      title: "Révisions optimisées",
      description: "Concentrez vos révisions sur ce qui compte vraiment grâce aux insights de l'IA.",
      details: [
        "Suggestions de révision personnalisées",
        "Priorisation des sujets à revoir",
        "Planning de révision intelligent",
        "Rappels et notifications"
      ]
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
              <Link href="/pricing">
                <Button variant="ghost" data-testid="button-pricing">Tarifs</Button>
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
              Fonctionnalités complètes pour réussir vos études
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Découvrez comment Corrige Tes Cours utilise l'intelligence artificielle DeepSeek R1 
              pour transformer votre façon d'apprendre et de réviser.
            </p>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer votre façon d'étudier ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez des milliers d'étudiants qui utilisent déjà Corrige Tes Cours pour améliorer leurs résultats.
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
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Corrige Tes Cours. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
