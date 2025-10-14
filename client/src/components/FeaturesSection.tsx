import { PenTool, FileText, HelpCircle, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: PenTool,
    title: 'Prise de notes interactive',
    description: 'Note tes cours directement depuis l\'appli, sans stress.',
  },
  {
    icon: FileText,
    title: 'Résumés automatiques par IA',
    description: 'Simplifie tes cours en un clic grâce à l\'intelligence artificielle.',
  },
  {
    icon: HelpCircle,
    title: 'Quiz intelligents',
    description: 'Teste-toi avec des questions adaptées à ton niveau.',
  },
  {
    icon: TrendingUp,
    title: 'Suivi de performance',
    description: 'Visualise tes progrès et reste motivé.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground" data-testid="text-features-title">
            Tout ce dont tu as besoin pour réussir
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-subtitle">
            Des outils puissants conçus pour les étudiants ambitieux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover-elevate transition-all duration-300 hover:-translate-y-1"
                data-testid={`card-feature-${index}`}
              >
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl" data-testid={`text-feature-title-${index}`}>
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed" data-testid={`text-feature-description-${index}`}>
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
