import { Button } from '@/components/ui/button';
import heroImage from '@assets/stock_images/student_studying_on__af7a3399.jpg';

export default function HeroSection() {
  const handleCTA = () => {
    window.location.href = '/signup';
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 bg-gradient-to-br from-primary via-primary to-[hsl(210,100%,12%)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" data-testid="text-hero-title">
                Ta révision devient intelligente.
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed" data-testid="text-hero-subtitle">
                Des résumés clairs, des quiz personnalisés et un suivi intelligent pour booster ta réussite.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button
                size="lg"
                variant="default"
                className="bg-white text-primary hover:bg-white/90 border-2 border-white text-base font-semibold px-8 shadow-lg"
                onClick={handleCTA}
                data-testid="button-hero-cta"
              >
                Créer un compte gratuit
              </Button>
            </div>

            <p className="text-sm text-white/70" data-testid="text-trust-indicator">
              Déjà 1000+ étudiants nous font confiance
            </p>
          </div>

          <div className="relative lg:block hidden">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Étudiant utilisant Corrige Tes Cours pour réviser"
                className="w-full h-auto object-cover"
                data-testid="img-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
