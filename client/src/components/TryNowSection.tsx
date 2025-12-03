import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, Sparkles, Zap, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function TryNowSection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

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

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t.tryNowSection.errors.unsupportedType,
        description: t.tryNowSection.errors.unsupportedTypeDesc,
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t.tryNowSection.errors.fileTooLarge,
        description: t.tryNowSection.errors.fileTooLargeDesc,
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
        
        if (error.existingUploadId) {
          toast({
            title: t.tryNowSection.errors.alreadyTried,
            description: t.tryNowSection.errors.alreadyTriedDesc,
          });
          setTimeout(() => {
            setLocation(`/try/${error.existingUploadId}`);
          }, 1000);
          return;
        }
        
        throw new Error(error.message || t.tryNowSection.errors.uploadFailed);
      }

      const data = await response.json();
      
      toast({
        title: t.tryNowSection.success.uploaded,
        description: t.tryNowSection.success.generating,
      });

      setLocation(`/try/${data.uploadId}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t.errors.generic,
        description: error instanceof Error ? error.message : t.tryNowSection.errors.genericError,
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
            {t.tryNowSection.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.tryNowSection.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.tryNowSection.subtitle}
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
                  {uploading ? t.tryNowSection.uploading : t.tryNowSection.uploadTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t.tryNowSection.supportedFormats}
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
                    {t.tryNowSection.uploading}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t.tryNowSection.chooseFile}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {t.tryNowSection.benefits.split('•')[0].trim()}
                </span>
                <span className="flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  {t.tryNowSection.benefits.split('•')[1]?.trim()}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
