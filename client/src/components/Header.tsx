import { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" data-testid="link-home" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">Corrige Tes Cours</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('fonctionnalites')}
              data-testid="button-nav-features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('avantages')}
              data-testid="button-nav-benefits"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tarifs
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              data-testid="button-nav-about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              À propos
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="default"
              data-testid="button-login"
              onClick={() => console.log('Connexion clicked')}
            >
              Connexion
            </Button>
            <Button
              variant="default"
              size="default"
              data-testid="button-signup-header"
              onClick={() => console.log('Créer un compte clicked')}
            >
              Créer un compte
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('fonctionnalites')}
                data-testid="button-mobile-features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => scrollToSection('avantages')}
                data-testid="button-mobile-benefits"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Tarifs
              </button>
              <button
                onClick={() => scrollToSection('footer')}
                data-testid="button-mobile-about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                À propos
              </button>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="default"
                  data-testid="button-mobile-login"
                  onClick={() => {
                    console.log('Connexion clicked');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Connexion
                </Button>
                <Button
                  variant="default"
                  size="default"
                  data-testid="button-mobile-signup"
                  onClick={() => {
                    console.log('Créer un compte clicked');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Créer un compte
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
