import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiGoogle } from 'react-icons/si';
import { UserPlus, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import SEO from '@/components/SEO';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const searchParams = new URLSearchParams(window.location.search);
  const uploadId = searchParams.get('uploadId');
  const refCode = searchParams.get('ref');

  // Validate referral code on mount
  useEffect(() => {
    if (refCode) {
      fetch(`/api/referral/validate/${refCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setReferralCode(refCode.toUpperCase());
            setReferrerName(data.referrerName);
          }
        })
        .catch(console.error);
    }
  }, [refCode]);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: t.signupPage.error,
        description: t.signupPage.passwordMismatch,
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: t.signupPage.error,
        description: t.signupPage.passwordTooShort,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, password, referralCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.signupPage.error);
      }

      if (uploadId) {
        try {
          const migrateResponse = await fetch(`/api/anonymous/${uploadId}/migrate`, {
            method: 'POST',
            credentials: 'include',
          });

          if (migrateResponse.ok) {
            toast({
              title: t.signupPage.success,
              description: t.signupPage.successWithCourse,
            });
          }
        } catch (migrateError) {
          console.error('Migration error:', migrateError);
        }
      }

      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: t.signupPage.error,
        description: error.message || t.errors.generic,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background p-4 relative overflow-hidden">
      <SEO 
        title={t.signupPage.title}
        description={t.signupPage.subtitle}
        url="https://corrigetescours.com/signup"
      />
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
            <h1 className="text-2xl font-bold" data-testid="text-signup-title">
              Corrige Tes Cours
            </h1>
          </div>
          <p className="text-muted-foreground">{t.signupPage.welcome}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-card/50">
          {referrerName && (
            <div className="bg-green-500/10 border-b border-green-500/20 p-3 text-center">
              <p className="text-sm text-green-700 dark:text-green-400">
                {language === 'fr' 
                  ? `Tu as été invité par ${referrerName}. Inscris-toi pour lui offrir 14 jours Premium gratuits !`
                  : `You were invited by ${referrerName}. Sign up to give them 14 free Premium days!`}
              </p>
            </div>
          )}
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t.signupPage.title}</CardTitle>
            <CardDescription className="text-center">
              {t.signupPage.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full"
              size="lg"
              data-testid="button-signup-google"
            >
              <SiGoogle className="h-5 w-5 mr-2" />
              {t.signupPage.continueWithGoogle}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t.signupPage.orWithEmail}</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.signupPage.firstName}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t.signupPage.firstNamePlaceholder}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-firstname"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.signupPage.lastName}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t.signupPage.lastNamePlaceholder}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-lastname"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.signupPage.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.signupPage.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.signupPage.password}</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.signupPage.confirmPassword}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
                data-testid="button-signup"
              >
                {isLoading ? (
                  t.signupPage.submitting
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    {t.signupPage.submit}
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm pt-4 border-t">
              <span className="text-muted-foreground">{t.signupPage.hasAccount} </span>
              <button
                onClick={() => setLocation('/login')}
                className="text-primary font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                data-testid="link-login"
              >
                {t.signupPage.login}
              </button>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.signupPage.termsNotice}
        </p>
      </motion.div>
    </div>
  );
}
