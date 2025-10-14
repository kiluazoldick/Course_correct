import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiGoogle } from 'react-icons/si';
import { UserPlus } from 'lucide-react';

export default function Signup() {
  const handleSignup = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#007BFF] to-[#001F3F] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" data-testid="text-signup-title">
            Corrige Tes Cours
          </h1>
          <p className="text-blue-100">Rejoignez des milliers d'étudiants qui réussissent</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center">
              Commencez votre parcours vers la réussite
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-[#007BFF] to-[#0056b3] hover:from-[#0056b3] hover:to-[#003d82] text-white"
              size="lg"
              data-testid="button-signup-replit"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              S'inscrire avec Replit
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Ou continuer avec</span>
              </div>
            </div>

            <Button
              onClick={handleSignup}
              variant="outline"
              className="w-full"
              size="lg"
              data-testid="button-signup-google"
            >
              <SiGoogle className="w-5 h-5 mr-2" />
              Google
            </Button>

            <div className="space-y-2 pt-2">
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

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
              <a
                href="/login"
                className="text-primary font-semibold hover:underline"
                data-testid="link-login"
              >
                Se connecter
              </a>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-blue-100 mt-6">
          En créant un compte, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}
