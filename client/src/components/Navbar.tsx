import { useState } from 'react';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { href: '/features', label: t.nav.features, testId: 'nav-features' },
    { href: '/pricing', label: t.nav.pricing, testId: 'nav-pricing' },
    { href: '/about', label: t.nav.about, testId: 'nav-about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home" className="flex items-center gap-2.5 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Corrige Tes Cours</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? 'secondary' : 'ghost'}
                  size="sm"
                  data-testid={`button-${item.testId}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" data-testid="button-login">
                {t.nav.login}
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="group" data-testid="button-signup-header">
                {t.nav.signup}
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`button-mobile-${item.testId}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t mt-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">{t.account.preferences.language}</span>
                  <LanguageToggle />
                </div>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-mobile-login"
                  >
                    {t.nav.login}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-mobile-signup"
                  >
                    {t.nav.signup}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
