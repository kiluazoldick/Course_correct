import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import TryNowSection from '@/components/TryNowSection';
import SEO from '@/components/SEO';
import { Brain, TrendingUp, BookOpen, Award, Sparkles, Zap, Target, ChevronRight, Upload, MessageCircle, BarChart3, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function Home() {
  const { t, language } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: t.landing.features.summary.title,
      description: t.landing.features.summary.description
    },
    {
      icon: BookOpen,
      title: t.landing.features.quiz.title,
      description: t.landing.features.quiz.description
    },
    {
      icon: TrendingUp,
      title: language === 'fr' ? "Suivi de Progression" : "Progress Tracking",
      description: language === 'fr' ? "Visualisez vos progrès et identifiez vos points à améliorer" : "Visualize your progress and identify areas to improve"
    },
    {
      icon: Award,
      title: language === 'fr' ? "Résultats Garantis" : "Guaranteed Results",
      description: language === 'fr' ? "Améliorez vos notes et réussissez vos examens avec confiance" : "Improve your grades and pass your exams with confidence"
    }
  ];

  const steps = [
    {
      icon: Upload,
      title: t.landing.howItWorks.step1.title,
      description: t.landing.howItWorks.step1.description
    },
    {
      icon: Sparkles,
      title: t.landing.howItWorks.step2.title,
      description: t.landing.howItWorks.step2.description
    },
    {
      icon: MessageCircle,
      title: language === 'fr' ? "Révisez avec Tariq IA" : "Review with Tariq AI",
      description: language === 'fr' ? "Posez vos questions et clarifiez les concepts difficiles" : "Ask questions and clarify difficult concepts"
    },
    {
      icon: BarChart3,
      title: t.landing.howItWorks.step3.title,
      description: t.landing.howItWorks.step3.description
    }
  ];

  const stats = language === 'fr' ? [
    { value: "5 min", label: "Temps moyen pour un résumé" },
    { value: "90%", label: "Étudiants satisfaits" },
    { value: "24/7", label: "Assistance IA disponible" },
    { value: "100%", label: "Gratuit pour commencer" }
  ] : [
    { value: "5 min", label: "Average time for a summary" },
    { value: "90%", label: "Satisfied students" },
    { value: "24/7", label: "AI assistance available" },
    { value: "100%", label: "Free to start" }
  ];

  const testimonials = language === 'fr' ? [
    {
      name: "Marie K.",
      role: "Étudiante en Médecine",
      content: "Corrige Tes Cours m'a fait gagner un temps fou. Les résumés sont précis et m'aident vraiment à retenir l'essentiel."
    },
    {
      name: "Joseph N.",
      role: "Étudiant en Droit",
      content: "Tariq IA est comme un tuteur personnel. Il répond à toutes mes questions et m'aide à comprendre les concepts complexes."
    },
    {
      name: "Aminata S.",
      role: "Étudiante en Économie",
      content: "Grâce aux quiz personnalisés, je sais exactement quoi réviser. Mes notes se sont vraiment améliorées !"
    }
  ] : [
    {
      name: "Marie K.",
      role: "Medical Student",
      content: "Corrige Tes Cours saved me so much time. The summaries are accurate and really help me retain the essentials."
    },
    {
      name: "Joseph N.",
      role: "Law Student",
      content: "Tariq AI is like a personal tutor. It answers all my questions and helps me understand complex concepts."
    },
    {
      name: "Aminata S.",
      role: "Economics Student",
      content: "Thanks to personalized quizzes, I know exactly what to review. My grades have really improved!"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        url="https://corrigetescours.com/"
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-block mb-6"
            >
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {language === 'fr' ? "Intelligence Artificielle de Pointe" : "Cutting-Edge AI"}
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70" data-testid="text-hero-title">
              {t.landing.heroTitle}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.landing.heroSubtitle}
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 group" data-testid="button-cta-signup">
                  {t.landing.cta}
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-cta-features">
                  {language === 'fr' ? "Découvrir les fonctionnalités" : "Discover features"}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </section>

        {/* Try Now Section - Anonymous Upload */}
        <TryNowSection />

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y bg-muted/20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How it works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t.landing.howItWorks.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'fr' ? "Un processus simple en 4 étapes pour transformer votre façon d'étudier" : "A simple 4-step process to transform the way you study"}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  <Card className="h-full hover-elevate transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t.landing.features.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.landing.features.subtitle}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="hover-elevate transition-all duration-300 h-full" data-testid={`card-feature-${index}`}>
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'fr' ? "Ce que disent nos étudiants" : "What our students say"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'fr' ? "Rejoignez des milliers d'étudiants qui transforment leur façon d'apprendre" : "Join thousands of students transforming the way they learn"}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover-elevate transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Sparkles key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                      <div className="border-t pt-4">
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/20 border-y">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-6">
                {language === 'fr' ? "Rejoignez des milliers d'étudiants satisfaits" : "Join thousands of satisfied students"}
              </h3>
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  {/* Trustpilot Widget */}
                  <div 
                    className="trustpilot-widget" 
                    data-locale={language === 'fr' ? "fr-FR" : "en-US"}
                    data-template-id="56278e9abfbbba0bdcd568bc" 
                    data-businessunit-id="68f27544aad66395e889c381" 
                    data-style-height="52px" 
                    data-style-width="100%" 
                    data-token="da1d8c6a-d9fe-4532-8a96-30cdc4b952d8"
                  >
                    <a href="https://fr.trustpilot.com/review/corrigetescours.com" target="_blank" rel="noopener" className="text-primary hover:underline">
                      {t.trustpilot.seeReviews}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden border-primary/20">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        {language === 'fr' ? "Promo Noël - 67% de réduction !" : "Christmas Promo - 67% off!"}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {language === 'fr' ? "Passez au Premium" : "Upgrade to Premium"}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {language === 'fr' 
                          ? "Uploads illimités, Tariq IA sans limite, statistiques avancées et support prioritaire pour seulement 500 XAF/mois"
                          : "Unlimited uploads, unlimited Tariq AI, advanced statistics and priority support for only 500 XAF/month"}
                      </p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span>{t.subscription.features.unlimitedUploads}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span>{t.subscription.features.unlimitedChat}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span>{t.subscription.features.advancedStats}</span>
                        </div>
                      </div>
                      <Link href="/pricing">
                        <Button size="lg" className="w-full md:w-auto">
                          {language === 'fr' ? "Voir les plans" : "View plans"}
                        </Button>
                      </Link>
                    </div>
                    <div className="flex justify-center">
                      <div className="text-center p-8 bg-background rounded-2xl border relative">
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -67%
                        </div>
                        <div className="text-sm text-muted-foreground line-through mb-1">1 500 XAF</div>
                        <div className="text-5xl font-bold mb-2 text-primary">500</div>
                        <div className="text-muted-foreground mb-4">XAF / {language === 'fr' ? 'mois' : 'month'}</div>
                        <div className="inline-flex items-center gap-2 text-sm text-red-500 font-medium">
                          <Target className="w-4 h-4" />
                          {language === 'fr' ? "Offre limitée !" : "Limited offer!"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.landing.cta2.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t.landing.cta2.subtitle}
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 group" data-testid="button-final-cta">
                {language === 'fr' ? "Créer mon compte gratuit" : "Create my free account"}
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              {language === 'fr' ? "Aucune carte bancaire requise • Démarrez en 2 minutes" : "No credit card required • Start in 2 minutes"}
            </p>
          </motion.div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
