import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ShareableStatsCard } from './ShareableStatsCard';
import { ShareableStatsCardExport } from './ShareableStatsCardExport';
import { Share2, Download, Copy, Check, Crown, Link2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { toPng } from 'html-to-image';
import type { Subscription, SharedStats } from '@shared/schema';

interface ShareStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: {
    totalQuizzes: number;
    totalCourses: number;
    averageScore: number;
    bestScore: number;
  };
  userName?: string;
}

export function ShareStatsDialog({ open, onOpenChange, stats, userName }: ShareStatsDialogProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const exportCardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: subscription } = useQuery<Subscription>({
    queryKey: ['/api/subscription'],
  });

  const isPremium = subscription?.status === 'premium';

  const generateShareMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/share-stats');
      return response.json() as Promise<SharedStats>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/share-stats'] });
    },
  });

  const { data: existingShareStats } = useQuery<SharedStats | null>({
    queryKey: ['/api/share-stats'],
  });

  const shareUrl = existingShareStats?.shareToken 
    ? `${window.location.origin}/share/${existingShareStats.shareToken}`
    : null;

  const handleGenerateLink = async () => {
    try {
      await generateShareMutation.mutateAsync();
      toast({
        title: language === 'fr' ? 'Lien créé !' : 'Link created!',
        description: language === 'fr' 
          ? 'Ton lien de partage est prêt'
          : 'Your share link is ready',
      });
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Impossible de créer le lien'
          : 'Failed to create link',
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = useCallback(() => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: language === 'fr' ? 'Lien copié !' : 'Link copied!',
        description: language === 'fr' 
          ? 'Partage ce lien avec tes amis'
          : 'Share this link with your friends',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl, toast, language]);

  const handleDownloadImage = async () => {
    if (!exportCardRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(exportCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
      });

      const link = document.createElement('a');
      link.download = `corrigetescours-stats-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: language === 'fr' ? 'Image téléchargée !' : 'Image downloaded!',
        description: language === 'fr' 
          ? 'Partage-la sur tes réseaux sociaux'
          : 'Share it on your social media',
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Impossible de générer l\'image'
          : 'Failed to generate image',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" data-testid="share-dialog-title">
            <Share2 className="w-5 h-5" />
            {language === 'fr' ? 'Partager mes performances' : 'Share my performance'}
          </DialogTitle>
          <DialogDescription data-testid="share-dialog-description">
            {language === 'fr' 
              ? 'Montre tes progrès à tes amis et inspire-les !'
              : 'Show your progress to friends and inspire them!'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="transform scale-[0.65] sm:scale-75 origin-center -my-16 sm:-my-12">
            <ShareableStatsCard
              ref={cardRef}
              totalQuizzes={stats.totalQuizzes}
              totalCourses={stats.totalCourses}
              averageScore={stats.averageScore}
              bestScore={stats.bestScore}
              userName={userName}
            />
          </div>
          
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
            <ShareableStatsCardExport
              ref={exportCardRef}
              totalQuizzes={stats.totalQuizzes}
              totalCourses={stats.totalCourses}
              averageScore={stats.averageScore}
              bestScore={stats.bestScore}
              userName={userName}
              language={language as 'fr' | 'en'}
            />
          </div>

          <div className="w-full space-y-3">
            {isPremium ? (
              <>
                <Button
                  onClick={handleDownloadImage}
                  disabled={isGenerating}
                  className="w-full gap-2"
                  size="lg"
                  data-testid="button-download-image"
                >
                  <Download className="w-4 h-4" />
                  {isGenerating 
                    ? (language === 'fr' ? 'Génération...' : 'Generating...')
                    : (language === 'fr' ? 'Télécharger l\'image' : 'Download image')}
                </Button>
                
                <div className="flex gap-2">
                  {!shareUrl ? (
                    <Button
                      onClick={handleGenerateLink}
                      disabled={generateShareMutation.isPending}
                      variant="outline"
                      className="flex-1 gap-2"
                      data-testid="button-generate-link"
                    >
                      <Link2 className="w-4 h-4" />
                      {generateShareMutation.isPending
                        ? (language === 'fr' ? 'Création...' : 'Creating...')
                        : (language === 'fr' ? 'Créer un lien' : 'Create link')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="flex-1 gap-2"
                      data-testid="button-copy-link"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          {language === 'fr' ? 'Copié !' : 'Copied!'}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {language === 'fr' ? 'Copier le lien' : 'Copy link'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {language === 'fr' ? 'Fonctionnalité Premium' : 'Premium Feature'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'fr' 
                      ? 'Passe au Premium pour télécharger l\'image directement'
                      : 'Upgrade to Premium to download the image directly'}
                  </p>
                </div>

                {!shareUrl ? (
                  <Button
                    onClick={handleGenerateLink}
                    disabled={generateShareMutation.isPending}
                    className="w-full gap-2"
                    size="lg"
                    data-testid="button-generate-link-free"
                  >
                    <Link2 className="w-4 h-4" />
                    {generateShareMutation.isPending
                      ? (language === 'fr' ? 'Création...' : 'Creating...')
                      : (language === 'fr' ? 'Créer un lien de partage' : 'Create share link')}
                  </Button>
                ) : (
                  <Button
                    onClick={handleCopyLink}
                    className="w-full gap-2"
                    size="lg"
                    data-testid="button-copy-link-free"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        {language === 'fr' ? 'Lien copié !' : 'Link copied!'}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {language === 'fr' ? 'Copier le lien' : 'Copy link'}
                      </>
                    )}
                  </Button>
                )}

                {shareUrl && (
                  <p className="text-xs text-center text-muted-foreground">
                    {language === 'fr' 
                      ? 'Les visiteurs verront un aperçu de tes stats et seront redirigés vers l\'app'
                      : 'Visitors will see a preview of your stats and be redirected to the app'}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
