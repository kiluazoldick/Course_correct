import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiGoogle } from 'react-icons/si';
import { LogIn, Mail, Lock, GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div 
            className="inline-flex items-center gap-2 mb-4 cursor-pointer hover-elevate rounded-md px-3 py-2" 
            onClick={() => setLocation('/')}
          >
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-login-title">
              Corrige Tes Cours
            </h1>
          </div>
          <p className="text-muted-foreground">{t.loginPage.welcome}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t.loginPage.title}</CardTitle>
            <CardDescription className="text-center">
              {t.loginPage.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                className="w-full"
                size="lg"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  t.loginPage.submitting
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    {t.loginPage.submit}
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t.loginPage.orContinueWith}</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
              size="lg"
              data-testid="button-login-google"
            >
              <SiGoogle className="h-5 w-5 mr-2" />
              Google
            </Button>

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
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.loginPage.termsNotice}
        </p>
      </motion.div>
    </div>
  );
}
