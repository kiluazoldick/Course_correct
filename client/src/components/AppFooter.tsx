import { GraduationCap, Mail, MapPin } from 'lucide-react';
import { Link } from 'wouter';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Corrige Tes Cours</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Plateforme d'apprentissage intelligente utilisant l'IA pour aider les étudiants à réussir leurs études.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-nav-title">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-features">
                    Fonctionnalités
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-pricing">
                    Tarifs
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                    À propos
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-contact-title">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span data-testid="text-footer-email">contact@corrigetescours.fr</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-footer-location">Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
              © {currentYear} Corrige Tes Cours. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-legal">
                Mentions légales
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                Confidentialité
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-terms">
                CGU
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
