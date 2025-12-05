import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const defaultMeta = {
  fr: {
    title: "Corrige Tes Cours - Plateforme IA pour Révisions & Réussite Universitaire au Cameroun",
    description: "Révise intelligemment avec l'IA ! Résumés automatiques de cours, quiz personnalisés, chatbot éducatif Tariq IA. Pour étudiants universitaires camerounais. Essai gratuit, Premium à 1500 FCFA/mois.",
    keywords: "révision intelligente, résumé de cours IA, quiz personnalisés, révision universitaire Cameroun, plateforme éducative IA, étudier efficacement, Tariq IA chatbot, réussite universitaire"
  },
  en: {
    title: "Corrige Tes Cours - AI Platform for University Success in Cameroon",
    description: "Study smarter with AI! Automatic course summaries, personalized quizzes, educational chatbot Tariq AI. For Cameroonian university students. Free trial, Premium at 1500 XAF/month.",
    keywords: "smart revision, AI course summary, personalized quizzes, university revision Cameroon, AI educational platform, study effectively, Tariq AI chatbot, academic success"
  }
};

export function SEO({ 
  title, 
  description, 
  keywords,
  image = "https://corrigetescours.com/og-image.png",
  url = "https://corrigetescours.com",
  type = "website"
}: SEOProps) {
  const { language } = useLanguage();
  const defaults = defaultMeta[language];
  
  const pageTitle = title 
    ? `${title} | Corrige Tes Cours` 
    : defaults.title;
  const pageDescription = description || defaults.description;
  const pageKeywords = keywords || defaults.keywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={image} />
      
      {/* Language */}
      <html lang={language === 'fr' ? 'fr' : 'en'} />
    </Helmet>
  );
}

export default SEO;
