import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiGoogle } from 'react-icons/si';
import { LogIn, Mail, Lock, GraduationCap, Brain, Layers, BookMarked, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import SEO from '@/components/SEO';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const uploadId = new URLSearchParams(window.location.search).get('uploadId');

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.loginPage.error);
      }

      if (uploadId) {
        try {
          const migrateResponse = await fetch(`/api/anonymous/${uploadId}/migrate`, {
            method: 'POST',
            credentials: 'include',
          });

          if (migrateResponse.ok) {
            toast({
              title: t.loginPage.success,
              description: t.loginPage.successWithCourse,
            });
          }
        } catch (migrateError) {
          console.error('Migration error:', migrateError);
        }
      }

      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: t.loginPage.error,
        description: error.message || t.errors.generic,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const sideFeatures = [
    { icon: Brain, label: language === 'fr' ? "Résumés IA instantanés" : "Instant AI summaries" },
    { icon: Layers, label: language === 'fr' ? "Flashcards intelligentes" : "Smart flashcards" },
    { icon: BookMarked, label: language === 'fr' ? "Guides d'étude personnalisés" : "Personalized study guides" },
  ];

  return (
    <div className="min-h-screen flex">
      <SEO 
        title={t.loginPage.title}
        description={t.loginPage.subtitle}
        url="https://corrigetescours.com/login"
      />

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Corrige Tes Cours</span>
          </div>
          
          <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
            {language === 'fr' ? "Étudie plus intelligemment, pas plus longtemps" : "Study smarter, not harder"}
          </h2>
          <p className="text-white/70 mb-10 text-lg leading-relaxed">
            {language === 'fr' 
              ? "Rejoins des centaines d'étudiants camerounais qui utilisent l'IA pour réussir leurs examens."
              : "Join hundreds of Cameroonian students using AI to ace their exams."}
          </p>

          <div className="space-y-4">
            {sideFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3 bg-white/10 rounded-xl p-4"
              >
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div 
            className="flex lg:hidden items-center gap-2.5 mb-8 cursor-pointer" 
            onClick={() => setLocation('/')}
          >
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold" data-testid="text-login-title">
              Corrige Tes Cours
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{t.loginPage.title}</h2>
            <p className="text-muted-foreground">{t.loginPage.subtitle}</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full"
                size="lg"
                data-testid="button-login-google"
              >
                <SiGoogle className="h-4 w-4 mr-2" />
                Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t.loginPage.orContinueWith}</span>
                </div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.loginPage.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.loginPage.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.loginPage.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full group"
                  size="lg"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? (
                    t.loginPage.submitting
                  ) : (
                    <>
                      {t.loginPage.submit}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm pt-4 border-t">
                <span className="text-muted-foreground">{t.loginPage.noAccount} </span>
                <button
                  onClick={() => setLocation('/signup')}
                  className="text-primary font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  data-testid="link-signup"
                >
                  {t.loginPage.createAccount}
                </button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {t.loginPage.termsNotice}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
