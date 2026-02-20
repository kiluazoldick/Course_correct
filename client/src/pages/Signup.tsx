import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiGoogle } from 'react-icons/si';
import { Mail, Lock, User, GraduationCap, Brain, Layers, BookMarked, ArrowRight, CheckCircle } from 'lucide-react';
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

  const sideFeatures = [
    { icon: Brain, label: language === 'fr' ? "Résumés IA instantanés" : "Instant AI summaries" },
    { icon: Layers, label: language === 'fr' ? "Flashcards intelligentes" : "Smart flashcards" },
    { icon: BookMarked, label: language === 'fr' ? "Guides d'étude personnalisés" : "Personalized study guides" },
  ];

  return (
    <div className="min-h-screen flex">
      <SEO 
        title={t.signupPage.title}
        description={t.signupPage.subtitle}
        url="https://corrigetescours.com/signup"
      />

      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.08),transparent)]" />
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Corrige Tes Cours</span>
          </div>
          
          <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
            {language === 'fr' ? "Commence à étudier plus efficacement" : "Start studying more effectively"}
          </h2>
          <p className="text-white/70 mb-10 text-lg leading-relaxed">
            {language === 'fr' 
              ? "Crée ton compte gratuit et accède à tous les outils IA dont tu as besoin pour réussir."
              : "Create your free account and access all the AI tools you need to succeed."}
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

          <div className="mt-10 flex items-center gap-3 text-sm text-white/60">
            <CheckCircle className="w-4 h-4" />
            <span>{language === 'fr' ? "100% gratuit pour commencer" : "100% free to start"}</span>
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
            <h1 className="text-xl font-bold" data-testid="text-signup-title">
              Corrige Tes Cours
            </h1>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{t.signupPage.title}</h2>
            <p className="text-muted-foreground">{t.signupPage.subtitle}</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              {referrerName && (
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg text-center">
                  <p className="text-sm text-primary">
                    {language === 'fr' 
                      ? `Invit\u00e9 par ${referrerName} \u2014 14 jours Premium gratuits pour vous deux !`
                      : `Invited by ${referrerName} \u2014 14 free Premium days for both of you!`}
                  </p>
                </div>
              )}

              <Button
                onClick={handleGoogleSignup}
                variant="outline"
                className="w-full"
                size="lg"
                data-testid="button-signup-google"
              >
                <SiGoogle className="h-4 w-4 mr-2" />
                {t.signupPage.continueWithGoogle}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t.signupPage.orWithEmail}</span>
                </div>
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-sm">{t.signupPage.firstName}</Label>
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

                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-sm">{t.signupPage.lastName}</Label>
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

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">{t.signupPage.email}</Label>
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

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">{t.signupPage.password}</Label>
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

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm">{t.signupPage.confirmPassword}</Label>
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
                  className="w-full group"
                  size="lg"
                  disabled={isLoading}
                  data-testid="button-signup"
                >
                  {isLoading ? (
                    t.signupPage.submitting
                  ) : (
                    <>
                      {t.signupPage.submit}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm pt-4 border-t">
                <span className="text-muted-foreground">{t.signupPage.hasAccount} </span>
                <button
                  onClick={() => setLocation('/login')}
                  className="text-primary font-semibold bg-transparent border-0 p-0 cursor-pointer"
                  data-testid="link-login"
                >
                  {t.signupPage.login}
                </button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {t.signupPage.termsNotice}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
