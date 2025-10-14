import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-[hsl(210,100%,12%)] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" data-testid="text-footer-links-title">Liens utiles</h3>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Mentions légales clicked');
                }}
                className="text-white/70 hover:text-white transition-colors text-sm"
                data-testid="link-legal"
              >
                Mentions légales
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Confidentialité clicked');
                }}
                className="text-white/70 hover:text-white transition-colors text-sm"
                data-testid="link-privacy"
              >
                Confidentialité
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Contact clicked');
                }}
                className="text-white/70 hover:text-white transition-colors text-sm"
                data-testid="link-contact"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold" data-testid="text-footer-copyright-title">À propos</h3>
            <p className="text-white/70 text-sm" data-testid="text-copyright">
              © 2025 Corrige Tes Cours. Tous droits réservés.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold" data-testid="text-footer-social-title">Suivez-nous</h3>
            <div className="flex gap-4">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Facebook clicked');
                }}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="link-facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Twitter clicked');
                }}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="link-twitter"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Instagram clicked');
                }}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="link-instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('LinkedIn clicked');
                }}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="link-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
