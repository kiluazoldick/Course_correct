import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiGoogle } from 'react-icons/si';
import { LogIn } from 'lucide-react';

export default function Login() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#007BFF] to-[#001F3F] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" data-testid="text-login-title">
            Corrige Tes Cours
          </h1>
          <p className="text-blue-100">Boostez votre réussite avec l'IA</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#007BFF] to-[#0056b3] hover:from-[#0056b3] hover:to-[#003d82] text-white"
              size="lg"
              data-testid="button-login"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Se connecter
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">OU</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <Button
              onClick={handleLogin}
              variant="outline"
              className="w-full"
              size="lg"
              data-testid="button-login-google"
            >
              <SiGoogle className="w-5 h-5 mr-2" />
              Continuer avec Google
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-2">
              L'authentification est sécurisée via Replit Auth (compatible Google)
            </p>

            <div className="text-center text-sm pt-4 border-t">
              <span className="text-muted-foreground">Pas encore de compte ? </span>
              <a
                href="/signup"
                className="text-primary font-semibold hover:underline"
                data-testid="link-signup"
              >
                Créer un compte
              </a>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-blue-100 mt-6">
          En vous connectant, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}
