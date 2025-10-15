import { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: '/features', label: 'Fonctionnalités', testId: 'nav-features' },
    { href: '/pricing', label: 'Tarifs', testId: 'nav-pricing' },
    { href: '/about', label: 'À propos', testId: 'nav-about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" data-testid="link-home" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Corrige Tes Cours</span>
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
            <Link href="/login">
              <Button variant="ghost" size="sm" data-testid="button-login">
                Connexion
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" data-testid="button-signup-header">
                Commencer
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2 pt-2 border-t mt-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-mobile-login"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="button-mobile-signup"
                  >
                    Commencer
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
