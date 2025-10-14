import { Button } from '@/components/ui/button';

export default function CTASection() {
  const handleCTA = () => {
    window.location.href = '/signup';
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-[hsl(210,100%,12%)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 z-0"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight" data-testid="text-cta-title">
            Prêt(e) à booster ta réussite ?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto" data-testid="text-cta-subtitle">
            Rejoins des milliers d'étudiants qui transforment leur façon de réviser
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 border-2 border-white text-base font-semibold px-8 shadow-lg"
              onClick={handleCTA}
              data-testid="button-cta-final"
            >
              Je crée mon compte gratuit maintenant
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
