import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiGoogle } from 'react-icons/si';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Redirect to dashboard
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Une erreur est survenue',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold text-white mb-2 cursor-pointer hover:opacity-90 transition-opacity" 
            data-testid="text-login-title"
            onClick={() => setLocation('/')}
          >
            Corrige Tes Cours
          </h1>
          <p className="text-white/90">Boostez votre réussite avec l'IA</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  'Connexion...'
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Se connecter
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
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
              size="lg"
              data-testid="button-login-google"
            >
              <SiGoogle className="w-5 h-5 mr-2" />
              Continuer avec Google
            </Button>

            <div className="text-center text-sm pt-4 border-t">
              <span className="text-muted-foreground">Pas encore de compte ? </span>
              <button
                onClick={() => setLocation('/signup')}
                className="text-primary font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                data-testid="link-signup"
              >
                Créer un compte
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-white/80 mt-6">
          En vous connectant, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}
