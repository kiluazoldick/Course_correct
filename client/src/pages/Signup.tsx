import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiGoogle } from 'react-icons/si';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Redirect to dashboard
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: 'Erreur d\'inscription',
        description: error.message || 'Une erreur est survenue',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold text-white mb-2 cursor-pointer hover:opacity-90 transition-opacity" 
            data-testid="text-signup-title"
            onClick={() => setLocation('/')}
          >
            Corrige Tes Cours
          </h1>
          <p className="text-white/90">Rejoignez des milliers d'étudiants qui réussissent</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center">
              Commencez votre parcours vers la réussite
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Jean"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                    required
                    minLength={2}
                    data-testid="input-firstname"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Dupont"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                    required
                    minLength={2}
                    data-testid="input-lastname"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                    data-testid="input-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
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
                  'Création du compte...'
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Créer mon compte
                  </>
                )}
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">OU</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <Button
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full"
              size="lg"
              data-testid="button-signup-google"
            >
              <SiGoogle className="w-5 h-5 mr-2" />
              Continuer avec Google
            </Button>

            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm font-medium text-center">Ce que vous obtenez :</p>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                <span>Résumés de cours générés par IA</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                <span>Quiz personnalisés et intelligents</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                <span>Suivi détaillé de vos performances</span>
              </div>
            </div>

            <div className="text-center text-sm pt-4 border-t">
              <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
              <button
                onClick={() => setLocation('/login')}
                className="text-primary font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                data-testid="link-login"
              >
                Se connecter
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-white/80 mt-6">
          En créant un compte, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}
