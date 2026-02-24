import { GraduationCap, Mail, MapPin } from 'lucide-react';
import { Link } from 'wouter';
import { SiFacebook, SiInstagram, SiX, SiTelegram } from 'react-icons/si';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();

  const socialLinks = [
    { href: "https://www.facebook.com/share/17ahNC7zbw/?mibextid=wwXIfr", icon: SiFacebook, label: "Facebook", testId: "link-footer-facebook" },
    { href: "https://www.instagram.com/corrigetescours_?igsh=MzE1dGRsb3ZlNWp2&utm_source=qr", icon: SiInstagram, label: "Instagram", testId: "link-footer-instagram" },
    { href: "https://x.com/corrigetescours?s=21", icon: SiX, label: "X (Twitter)", testId: "link-footer-twitter" },
    { href: "https://t.me/corrigetesc0urs", icon: SiTelegram, label: "Telegram", testId: "link-footer-telegram" },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">Corrige Tes Cours</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              {t.footer.description}
            </p>
            
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a 
                  key={social.testId}
                  href={social.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover-elevate"
                  data-testid={social.testId}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4" data-testid="text-footer-nav-title">{t.footer.navigation}</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/features", label: t.nav.features, testId: "link-footer-features" },
                { href: "/pricing", label: t.nav.pricing, testId: "link-footer-pricing" },
                { href: "/about", label: t.nav.about, testId: "link-footer-about" },
              ].map((link) => (
                <li key={link.testId}>
                  <Link href={link.href} className="text-sm text-muted-foreground" data-testid={link.testId}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4" data-testid="text-footer-legal-title">{t.footer.legalSection}</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/legal", label: t.footer.legal, testId: "link-footer-legal" },
                { href: "/privacy", label: t.footer.privacy, testId: "link-footer-privacy" },
                { href: "/terms", label: t.footer.terms, testId: "link-footer-terms" },
              ].map((link) => (
                <li key={link.testId}>
                  <Link href={link.href} className="text-sm text-muted-foreground" data-testid={link.testId}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4" data-testid="text-footer-contact-title">{t.footer.contact}</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span data-testid="text-footer-email">contact@corrigetescours.cm</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span data-testid="text-footer-location">{language === 'fr' ? 'En ligne, partout dans le monde' : 'Online, worldwide'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t">
          <p className="text-center text-xs text-muted-foreground" data-testid="text-footer-copyright">
            © {currentYear} Corrige Tes Cours. {t.footer.copyright}.
          </p>
        </div>
      </div>
    </footer>
  );
}
