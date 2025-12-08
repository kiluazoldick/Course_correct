import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { ShareableStatsCard } from '@/components/ShareableStatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { SharedStats } from '@shared/schema';
import { Helmet } from 'react-helmet-async';

export default function SharedStatsPage() {
  const { language } = useLanguage();
  const [, params] = useRoute('/share/:token');
  const [, setLocation] = useLocation();
  const token = params?.token;

  const { data: stats, isLoading, error } = useQuery<SharedStats>({
    queryKey: ['/api/shared', token],
    queryFn: async () => {
      const response = await fetch(`/api/shared/${token}`);
      if (!response.ok) {
        throw new Error('Stats not found');
      }
      return response.json();
    },
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-xl font-bold mb-2" data-testid="text-stats-not-found">
              {language === 'fr' ? 'Stats non trouvées' : 'Stats not found'}
            </h1>
            <p className="text-muted-foreground mb-4">
              {language === 'fr' 
                ? 'Ce lien de partage n\'existe plus ou a expiré.'
                : 'This share link no longer exists or has expired.'}
            </p>
            <Button onClick={() => setLocation('/')} data-testid="button-go-home">
              {language === 'fr' ? 'Découvrir Corrige Tes Cours' : 'Discover Corrige Tes Cours'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pageTitle = stats.userName 
    ? `${stats.userName} - Performances | Corrige Tes Cours`
    : 'Performances | Corrige Tes Cours';
  
  const pageDescription = language === 'fr'
    ? `${stats.userName || 'Un étudiant'} a passé ${stats.totalQuizzes} quiz avec une moyenne de ${stats.averageScore}%. Découvre Corrige Tes Cours !`
    : `${stats.userName || 'A student'} took ${stats.totalQuizzes} quizzes with an average of ${stats.averageScore}%. Discover Corrige Tes Cours!`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://corrigetescours.com/share/${token}`} />
        <meta property="og:image" content="https://corrigetescours.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Corrige Tes Cours" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://corrigetescours.com/og-image.png" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Corrige Tes Cours</span>
          </div>
          <p className="text-muted-foreground text-sm">
            {language === 'fr' 
              ? 'L\'IA qui booste tes révisions'
              : 'AI that boosts your studies'}
          </p>
        </div>

        <div className="transform scale-[0.85] sm:scale-100 origin-center">
          <ShareableStatsCard
            totalQuizzes={stats.totalQuizzes}
            totalCourses={stats.totalCourses}
            averageScore={stats.averageScore}
            bestScore={stats.bestScore}
            userName={stats.userName || undefined}
          />
        </div>

        <div className="mt-8 text-center max-w-md">
          <h2 className="text-lg font-semibold mb-2" data-testid="text-cta-title">
            {language === 'fr' 
              ? 'Envie de suivre tes progrès aussi ?'
              : 'Want to track your progress too?'}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            {language === 'fr' 
              ? 'Rejoins des milliers d\'étudiants qui révisent plus intelligemment avec Corrige Tes Cours'
              : 'Join thousands of students who study smarter with Corrige Tes Cours'}
          </p>
          <Button 
            size="lg" 
            onClick={() => setLocation('/auth')}
            className="gap-2"
            data-testid="button-join-now"
          >
            {language === 'fr' ? 'Commencer gratuitement' : 'Start for free'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          {language === 'fr' 
            ? 'Résumés IA • Quiz personnalisés • Chatbot 24/7'
            : 'AI Summaries • Personalized Quizzes • 24/7 Chatbot'}
        </p>
      </div>
    </>
  );
}
