import { Clock, Brain, Monitor } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const benefits = [
  {
    icon: Clock,
    title: 'Gain de temps',
    description: 'Révise deux fois plus vite grâce à nos résumés intelligents et nos outils de prise de notes optimisés.',
  },
  {
    icon: Brain,
    title: 'Mémorisation efficace',
    description: 'Ancre tes connaissances durablement avec nos quiz adaptatifs et notre système de révision espacée.',
  },
  {
    icon: Monitor,
    title: 'Interface intuitive',
    description: 'Une expérience utilisateur pensée pour les étudiants : simple, rapide et agréable à utiliser.',
  },
];

export default function BenefitsSection() {
  return (
    <section id="avantages" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground" data-testid="text-benefits-title">
            Parce que bien réviser, c'est bien réussir
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-benefits-subtitle">
            Découvre pourquoi Corrige Tes Cours est unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="text-center hover-elevate transition-all duration-300 hover:-translate-y-1"
                data-testid={`card-benefit-${index}`}
              >
                <CardHeader className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-2xl" data-testid={`text-benefit-title-${index}`}>
                      {benefit.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed" data-testid={`text-benefit-description-${index}`}>
                      {benefit.description}
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
