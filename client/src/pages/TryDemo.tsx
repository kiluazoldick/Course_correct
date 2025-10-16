import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { motion } from 'framer-motion';

interface AnonymousUpload {
  id: string;
  title: string;
  content: string;
  summary: string | null;
}

export default function TryDemo() {
  const [, params] = useRoute('/try/:uploadId');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [hasRequestedSummary, setHasRequestedSummary] = useState(false);
  const uploadId = params?.uploadId || '';

  // Reset state when uploadId changes
  useEffect(() => {
    setHasRequestedSummary(false);
    summarizeMutation.reset(); // Clear any previous error/success state
  }, [uploadId]);

  // Fetch the anonymous upload
  const { data: upload, isLoading } = useQuery<AnonymousUpload>({
    queryKey: ['/api/anonymous', uploadId],
    enabled: !!uploadId,
  });

  // Generate summary mutation - pass uploadId as context to avoid race conditions
  const summarizeMutation = useMutation({
    mutationFn: async (targetUploadId: string) => {
      const res = await apiRequest('POST', `/api/anonymous/${targetUploadId}/summarize`);
      return res.json();
    },
    onSuccess: (data, targetUploadId) => {
      // Only update if this is still the current upload (prevent race conditions)
      if (targetUploadId === uploadId) {
        queryClient.setQueryData(['/api/anonymous', targetUploadId], (oldData: AnonymousUpload | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, summary: data.summary };
        });
        
        toast({
          title: "Résumé généré !",
          description: "Votre résumé est prêt. Créez un compte gratuit pour le télécharger.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le résumé",
        variant: "destructive",
      });
      // Don't reset hasRequestedSummary to prevent retry loops
    },
  });

  // Auto-generate summary when upload is loaded (only once per upload, stop on error)
  useEffect(() => {
    if (upload && !upload.summary && !hasRequestedSummary && !summarizeMutation.isPending && !summarizeMutation.isError) {
      setHasRequestedSummary(true);
      summarizeMutation.mutate(uploadId); // Pass uploadId as argument
    }
  }, [upload, hasRequestedSummary]);

  const handleDownloadPDF = () => {
    setShowSignupModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (!upload) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Upload introuvable</h1>
            <p className="text-muted-foreground mb-6">
              Ce lien a peut-être expiré. Essayez de nouveau !
            </p>
            <Link href="/">
              <Button data-testid="button-back-home">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">Essai Gratuit</span>
              </div>
              <CardTitle className="text-2xl" data-testid="text-upload-title">{upload.title}</CardTitle>
              <CardDescription>
                Voici votre résumé généré par l'IA. Créez un compte gratuit pour télécharger le PDF et accéder à toutes les fonctionnalités !
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Résumé Intelligent
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summarizeMutation.isPending ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-summary" />
                  <span className="ml-3 text-muted-foreground">Génération du résumé en cours...</span>
                </div>
              ) : summarizeMutation.isError ? (
                <div className="text-center py-8">
                  <p className="text-destructive mb-4">Erreur lors de la génération du résumé</p>
                  <Button 
                    onClick={() => {
                      setHasRequestedSummary(false);
                      summarizeMutation.reset();
                      summarizeMutation.mutate(uploadId); // Pass uploadId as argument
                    }}
                    variant="outline"
                    data-testid="button-retry-summary"
                  >
                    Réessayer
                  </Button>
                </div>
              ) : upload.summary ? (
                <div className="prose prose-sm max-w-none" data-testid="text-summary-content">
                  <div className="whitespace-pre-wrap">{upload.summary}</div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Résumé en cours de génération...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Vous aimez ce que vous voyez ?</h3>
                <p className="text-muted-foreground">
                  Créez un compte gratuit pour télécharger ce résumé en PDF et débloquer toutes les fonctionnalités !
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={handleDownloadPDF}
                    size="lg"
                    className="group"
                    data-testid="button-download-pdf"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le PDF
                  </Button>
                  <Link href="/signup">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="group w-full sm:w-auto"
                      data-testid="button-create-account"
                    >
                      Créer un compte gratuit
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Signup Modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent data-testid="modal-signup-prompt">
          <DialogHeader>
            <DialogTitle>Créez votre compte gratuit</DialogTitle>
            <DialogDescription>
              Pour télécharger votre résumé en PDF et accéder à toutes les fonctionnalités, créez votre compte gratuitement en quelques secondes !
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="font-medium">Avec un compte gratuit, vous pouvez :</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Télécharger vos résumés en PDF</li>
                <li>✓ Sauvegarder jusqu'à 2 cours par mois</li>
                <li>✓ Générer des quiz personnalisés</li>
                <li>✓ Discuter avec Tariq IA (5 messages/session)</li>
              </ul>
            </div>
            <Link href={`/signup?uploadId=${uploadId}`}>
              <Button className="w-full" size="lg" data-testid="button-signup-now">
                Créer mon compte gratuit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={`/login?uploadId=${uploadId}`}>
              <Button variant="outline" className="w-full" data-testid="button-login-existing">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <AppFooter />
    </div>
  );
}
