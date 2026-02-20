import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import TryNowSection from '@/components/TryNowSection';
import SEO from '@/components/SEO';
import { Brain, TrendingUp, BookOpen, Award, Sparkles, Zap, ChevronRight, Upload, MessageCircle, BarChart3, CheckCircle, Layers, BookMarked, GraduationCap, ArrowRight, Star, Users, Shield, Clock, FileText, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function Home() {
  const { t, language } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: t.landing.features.summary.title,
      description: t.landing.features.summary.description,
    },
    {
      icon: BookOpen,
      title: t.landing.features.quiz.title,
      description: t.landing.features.quiz.description,
    },
    {
      icon: Layers,
      title: language === 'fr' ? "Flashcards IA" : "AI Flashcards",
      description: language === 'fr' ? "Générez des flashcards intelligentes depuis vos cours et révisez efficacement avec le suivi de progression" : "Generate smart flashcards from your courses and review efficiently with progress tracking",
    },
    {
      icon: BookMarked,
      title: language === 'fr' ? "Guide d'Étude IA" : "AI Study Guide",
      description: language === 'fr' ? "Obtenez des guides de révision structurés avec objectifs, concepts clés et exercices pratiques" : "Get structured study guides with objectives, key concepts and practice exercises",
    },
    {
      icon: MessageCircle,
      title: language === 'fr' ? "Tariq IA" : "Tariq AI",
      description: language === 'fr' ? "Votre tuteur IA personnel qui répond à toutes vos questions et vous motive" : "Your personal AI tutor who answers all your questions and motivates you",
    },
    {
      icon: TrendingUp,
      title: language === 'fr' ? "Suivi de Progression" : "Progress Tracking",
      description: language === 'fr' ? "Visualisez vos progrès et identifiez vos points à améliorer avec des statistiques détaillées" : "Visualize your progress and identify areas to improve with detailed statistics",
    },
  ];

  const steps = [
    {
      icon: Upload,
      title: t.landing.howItWorks.step1.title,
      description: t.landing.howItWorks.step1.description,
      step: "01",
    },
    {
      icon: Sparkles,
      title: t.landing.howItWorks.step2.title,
      description: t.landing.howItWorks.step2.description,
      step: "02",
    },
    {
      icon: MessageCircle,
      title: language === 'fr' ? "Révisez avec Tariq IA" : "Review with Tariq AI",
      description: language === 'fr' ? "Posez vos questions et clarifiez les concepts difficiles" : "Ask questions and clarify difficult concepts",
      step: "03",
    },
    {
      icon: BarChart3,
      title: t.landing.howItWorks.step3.title,
      description: t.landing.howItWorks.step3.description,
      step: "04",
    },
  ];

  const stats = language === 'fr' ? [
    { value: "5 min", label: "Temps moyen pour un résumé", icon: Zap },
    { value: "90%", label: "Étudiants satisfaits", icon: Star },
    { value: "24/7", label: "Assistance IA disponible", icon: MessageCircle },
    { value: "100%", label: "Gratuit pour commencer", icon: GraduationCap },
  ] : [
    { value: "5 min", label: "Average time for a summary", icon: Zap },
    { value: "90%", label: "Satisfied students", icon: Star },
    { value: "24/7", label: "AI assistance available", icon: MessageCircle },
    { value: "100%", label: "Free to start", icon: GraduationCap },
  ];

  const whyChooseUs = language === 'fr' ? [
    {
      icon: Target,
      title: "Conçu pour les étudiants camerounais",
      description: "Notre plateforme est spécialement adaptée au système universitaire camerounais et francophone.",
    },
    {
      icon: Shield,
      title: "Données 100% sécurisées",
      description: "Vos cours et données personnelles sont protégés et ne sont jamais partagés avec des tiers.",
    },
    {
      icon: Clock,
      title: "Gain de temps considérable",
      description: "Réduisez vos heures de révision de moitié grâce à l'IA qui extrait l'essentiel de vos cours.",
    },
    {
      icon: Award,
      title: "Prix accessible pour tous",
      description: "Seulement 500 XAF/mois pour le Premium. Payez facilement via Mobile Money (MTN, Orange).",
    },
  ] : [
    {
      icon: Target,
      title: "Made for Cameroonian students",
      description: "Our platform is specially adapted to the Cameroonian and francophone university system.",
    },
    {
      icon: Shield,
      title: "100% secure data",
      description: "Your courses and personal data are protected and never shared with third parties.",
    },
    {
      icon: Clock,
      title: "Significant time savings",
      description: "Cut your study hours in half with AI that extracts the essentials from your courses.",
    },
    {
      icon: Award,
      title: "Affordable for everyone",
      description: "Only 500 XAF/month for Premium. Pay easily via Mobile Money (MTN, Orange).",
    },
  ];

  const testimonials = language === 'fr' ? [
    {
      name: "Marie K.",
      role: "Étudiante en Médecine, UDs",
      content: "Corrige Tes Cours m'a fait gagner un temps fou. Les résumés sont précis et m'aident vraiment à retenir l'essentiel.",
      rating: 5,
    },
    {
      name: "Joseph N.",
      role: "Étudiant en Droit, UY1",
      content: "Tariq IA est comme un tuteur personnel. Il répond à toutes mes questions et m'aide à comprendre les concepts complexes.",
      rating: 5,
    },
    {
      name: "Aminata S.",
      role: "Étudiante en Économie, UDla",
      content: "Grâce aux quiz personnalisés et aux flashcards, je sais exactement quoi réviser. Mes notes se sont vraiment améliorées !",
      rating: 5,
    },
    {
      name: "Paul T.",
      role: "Étudiant en Informatique, UY1",
      content: "Le guide d'étude IA m'a aidé à structurer mes révisions avant les examens. Je ne pourrais plus m'en passer.",
      rating: 5,
    },
  ] : [
    {
      name: "Marie K.",
      role: "Medical Student, UDs",
      content: "Corrige Tes Cours saved me so much time. The summaries are accurate and really help me retain the essentials.",
      rating: 5,
    },
    {
      name: "Joseph N.",
      role: "Law Student, UY1",
      content: "Tariq AI is like a personal tutor. It answers all my questions and helps me understand complex concepts.",
      rating: 5,
    },
    {
      name: "Aminata S.",
      role: "Economics Student, UDla",
      content: "Thanks to personalized quizzes and flashcards, I know exactly what to review. My grades have really improved!",
      rating: 5,
    },
    {
      name: "Paul T.",
      role: "CS Student, UY1",
      content: "The AI study guide helped me structure my revision before exams. I couldn't do without it now.",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO url="https://corrigetescours.com/" />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Clean with 3D card */}
        <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Badge variant="secondary" className="mb-6">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {language === 'fr' ? "Propulsé par l'IA" : "Powered by AI"}
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6" data-testid="text-hero-title">
                  {t.landing.heroTitle}
                </h1>

                <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  {t.landing.heroSubtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto group" data-testid="button-cta-signup">
                      {t.landing.cta}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-cta-features">
                      {language === 'fr' ? "Découvrir" : "Discover"}
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                    {['M', 'J', 'A', 'S'].map((initial, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium text-primary">
                        {initial}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                      ))}
                    </div>
                    <span>{language === 'fr' ? "Rejoins des centaines d'étudiants" : "Join hundreds of students"}</span>
                  </div>
                </div>
              </motion.div>

              {/* 3D Card Preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block"
              >
                <div 
                  className="relative"
                  style={{ perspective: '1200px' }}
                >
                  <Card 
                    className="relative"
                    style={{ 
                      transform: 'rotateY(-4deg) rotateX(2deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{language === 'fr' ? "Ton espace d'étude" : "Your study space"}</p>
                          <p className="text-xs text-muted-foreground">{language === 'fr' ? "Tout en un seul endroit" : "All in one place"}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { icon: Brain, label: language === 'fr' ? "Résumé IA généré" : "AI Summary generated" },
                          { icon: Layers, label: language === 'fr' ? "15 flashcards créées" : "15 flashcards created" },
                          { icon: CheckCircle, label: language === 'fr' ? "Quiz: 85% de réussite" : "Quiz: 85% success" },
                          { icon: BookMarked, label: language === 'fr' ? "Guide d'étude prêt" : "Study guide ready" },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
                            <CheckCircle className="w-4 h-4 text-primary ml-auto" />
                          </motion.div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span>{language === 'fr' ? "Progression globale" : "Overall progress"}</span>
                        <span className="font-medium text-foreground">85%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Floating mini cards for 3D depth */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="absolute -bottom-4 -left-6"
                    style={{ transform: 'rotateY(-4deg) rotateX(2deg) translateZ(30px)' }}
                  >
                    <Card className="shadow-lg">
                      <CardContent className="p-3 flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/10 rounded-md flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-medium">{language === 'fr' ? "Résumé en 5 min" : "Summary in 5 min"}</span>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7, duration: 0.6 }}
                    className="absolute -top-4 -right-6"
                    style={{ transform: 'rotateY(-4deg) rotateX(2deg) translateZ(40px)' }}
                  >
                    <Card className="shadow-lg">
                      <CardContent className="p-3 flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/10 rounded-md flex items-center justify-center">
                          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                        </div>
                        <span className="text-xs font-medium">4.9/5</span>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y bg-muted/30">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Try Now Section */}
        <TryNowSection />

        {/* How it works Section */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">
                {language === 'fr' ? "Simple et efficace" : "Simple and effective"}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {t.landing.howItWorks.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'fr' ? "4 étapes pour transformer ta façon d'étudier" : "4 steps to transform the way you study"}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  <Card className="h-full hover-elevate">
                    <CardContent className="p-6 pt-8">
                      <div className="text-6xl font-bold text-primary/10 absolute top-3 right-4 select-none">
                        {step.step}
                      </div>
                      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 relative">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                {language === 'fr' ? "Fonctionnalités" : "Features"}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
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
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="hover-elevate h-full" data-testid={`card-feature-${index}`}>
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                {language === 'fr' ? "Pourquoi nous choisir" : "Why choose us"}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {language === 'fr' ? "Fait pour toi, par des étudiants camerounais" : "Made for you, by Cameroonian students"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'fr' 
                  ? "Nous comprenons les défis des étudiants camerounais parce que nous les avons vécus."
                  : "We understand the challenges of Cameroonian students because we've lived them."}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {whyChooseUs.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover-elevate" data-testid={`card-why-${index}`}>
                    <CardContent className="p-6 flex gap-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">
                <Users className="w-3 h-3 mr-1" />
                {language === 'fr' ? "Témoignages" : "Testimonials"}
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {language === 'fr' ? "Ce que disent nos étudiants" : "What our students say"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'fr' ? "Ils ont transformé leur façon d'apprendre" : "They've transformed the way they learn"}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover-elevate">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trustpilot Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-y">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-6">
                {language === 'fr' ? "Rejoins des milliers d'étudiants satisfaits" : "Join thousands of satisfied students"}
              </h3>
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <div 
                    className="trustpilot-widget" 
                    data-locale={language === 'fr' ? "fr-FR" : "en-US"}
                    data-template-id="56278e9abfbbba0bdcd568bc" 
                    data-businessunit-id="68f27544aad66395e889c381" 
                    data-style-height="52px" 
                    data-style-width="100%" 
                    data-token="da1d8c6a-d9fe-4532-8a96-30cdc4b952d8"
                  >
                    <a href="https://fr.trustpilot.com/review/corrigetescours.com" target="_blank" rel="noopener" className="text-primary">
                      {t.trustpilot.seeReviews}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-primary">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent)]" />
                <div className="relative p-8 md:p-12 lg:p-16">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-white">
                      <Badge className="bg-white/20 border-white/30 text-white mb-6 no-default-hover-elevate no-default-active-elevate">
                        <Zap className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {language === 'fr' ? "Passe au niveau supérieur" : "Level up your studies"}
                      </h2>
                      <p className="text-white/80 mb-6 leading-relaxed">
                        {language === 'fr' 
                          ? "Uploads illimités, Tariq IA sans limite, flashcards illimitées, guides d'étude IA et statistiques avancées."
                          : "Unlimited uploads, unlimited Tariq AI, unlimited flashcards, AI study guides and advanced statistics."}
                      </p>
                      <div className="space-y-3 mb-8">
                        {[
                          t.subscription.features.unlimitedUploads,
                          t.subscription.features.unlimitedChat,
                          language === 'fr' ? "Flashcards illimitées" : "Unlimited flashcards",
                          language === 'fr' ? "Guides d'étude IA" : "AI study guides",
                          t.subscription.features.advancedStats,
                        ].map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-white/80 shrink-0" />
                            <span className="text-white/90 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href="/pricing">
                        <Button size="lg" variant="secondary" className="w-full md:w-auto">
                          {language === 'fr' ? "Voir les plans" : "View plans"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex justify-center">
                      <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="text-white/60 text-sm mb-1">{language === 'fr' ? 'A partir de' : 'Starting at'}</div>
                        <div className="text-6xl font-bold text-white mb-1">500</div>
                        <div className="text-white/70 mb-1">XAF / {language === 'fr' ? 'mois' : 'month'}</div>
                        <div className="text-white/50 text-sm mb-4">{language === 'fr' ? 'ou' : 'or'} $1 USD / {language === 'fr' ? 'mois' : 'month'}</div>
                        <div className="inline-flex items-center gap-2 text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full">
                          <Award className="w-3 h-3" />
                          {language === 'fr' ? "Annuler à tout moment" : "Cancel anytime"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t.landing.cta2.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t.landing.cta2.subtitle}
            </p>
            <Link href="/signup">
              <Button size="lg" className="group" data-testid="button-final-cta">
                {language === 'fr' ? "Créer mon compte gratuit" : "Create my free account"}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              {language === 'fr' ? "Aucune carte bancaire requise" : "No credit card required"}
            </p>
          </motion.div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
