import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function TryNowSection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('anonymousSessionId');
    if (!sessionId) {
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymousSessionId', sessionId);
    }
    return sessionId;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez uploader un fichier PDF ou Word (.docx)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10 MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const sessionId = getOrCreateSessionId();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      const response = await fetch('/api/anonymous/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        
        // If user already tried, redirect to existing upload
        if (error.existingUploadId) {
          toast({
            title: "Vous avez déjà testé !",
            description: "Redirection vers votre résumé...",
          });
          setTimeout(() => {
            setLocation(`/try/${error.existingUploadId}`);
          }, 1000);
          return;
        }
        
        throw new Error(error.message || 'Upload échoué');
      }

      const data = await response.json();
      
      toast({
        title: "Fichier uploadé !",
        description: "Génération de votre résumé en cours...",
      });

      // Redirect to the preview page
      setLocation(`/try/${data.uploadId}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'uploader le fichier",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Essai Gratuit Sans Inscription
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Testez l'IA maintenant
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uploadez un cours et obtenez un résumé intelligent en quelques secondes. Aucun compte requis pour essayer !
          </p>
        </div>

        <Card className="border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-primary" />
                )}
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">
                  {uploading ? "Upload en cours..." : "Uploadez votre premier cours"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Formats supportés : PDF, Word (.docx) • Max 10 MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
                data-testid="input-file-upload"
              />

              <Button
                size="lg"
                onClick={handleButtonClick}
                disabled={uploading}
                className="px-8"
                data-testid="button-upload-file"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choisir un fichier
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                ⚡ Résumé généré en moins de 30 secondes • 🎁 1 essai gratuit sans inscription
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
