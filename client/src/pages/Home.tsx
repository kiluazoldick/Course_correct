import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Brain, TrendingUp, BookOpen, Award, Sparkles, Zap, Target, ChevronRight, Upload, MessageCircle, BarChart3, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "Résumés Intelligents",
      description: "Des résumés clairs et structurés de vos cours en quelques secondes"
    },
    {
      icon: BookOpen,
      title: "Quiz Personnalisés",
      description: "Testez vos connaissances avec des questions adaptées à votre niveau"
    },
    {
      icon: TrendingUp,
      title: "Suivi de Progression",
      description: "Visualisez vos progrès et identifiez vos points à améliorer"
    },
    {
      icon: Award,
      title: "Résultats Garantis",
      description: "Améliorez vos notes et réussissez vos examens avec confiance"
    }
  ];

  const steps = [
    {
      icon: Upload,
      title: "Importez vos cours",
      description: "Saisissez ou uploadez vos notes de cours en PDF ou Word"
    },
    {
      icon: Sparkles,
      title: "L'IA résume pour vous",
      description: "Obtenez un résumé clair et structuré instantanément"
    },
    {
      icon: MessageCircle,
      title: "Révisez avec Tariq IA",
      description: "Posez vos questions et clarifiez les concepts difficiles"
    },
    {
      icon: BarChart3,
      title: "Progressez rapidement",
      description: "Suivez vos résultats et améliorez vos performances"
    }
  ];

  const stats = [
    { value: "5 min", label: "Temps moyen pour un résumé" },
    { value: "90%", label: "Étudiants satisfaits" },
    { value: "24/7", label: "Assistance IA disponible" },
    { value: "100%", label: "Gratuit pour commencer" }
  ];

  const testimonials = [
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
                Intelligence Artificielle de Pointe
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70" data-testid="text-hero-title">
              Réussissez vos études avec l'IA
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Transformez vos cours en résumés clairs, testez vos connaissances avec des quiz intelligents et progressez avec Tariq IA
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 group" data-testid="button-cta-signup">
                  Commencer gratuitement
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-cta-features">
                  Découvrir les fonctionnalités
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </section>

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
                Comment ça marche ?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un processus simple en 4 étapes pour transformer votre façon d'étudier
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
                Tout ce dont vous avez besoin pour réussir
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des outils puissants mais simples à utiliser pour optimiser vos révisions
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
                Ce que disent nos étudiants
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Rejoignez des milliers d'étudiants qui transforment leur façon d'apprendre
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
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        Offre de lancement
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Passez au Premium
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Uploads illimités, Tariq IA sans limite, statistiques avancées et support prioritaire pour seulement 1 500 XAF/mois
                      </p>
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span>Uploads de fichiers illimités</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span>Tariq IA illimité (0 cooldown)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span>Statistiques avancées</span>
                        </div>
                      </div>
                      <Link href="/pricing">
                        <Button size="lg" className="w-full md:w-auto">
                          Voir les plans
                        </Button>
                      </Link>
                    </div>
                    <div className="flex justify-center">
                      <div className="text-center p-8 bg-background rounded-2xl border">
                        <div className="text-5xl font-bold mb-2">1 500</div>
                        <div className="text-muted-foreground mb-4">XAF / mois</div>
                        <div className="inline-flex items-center gap-2 text-sm text-primary">
                          <Target className="w-4 h-4" />
                          Essai gratuit disponible
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
              Prêt à transformer vos révisions ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez des milliers d'étudiants qui réussissent avec Corrige Tes Cours
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 group" data-testid="button-final-cta">
                Créer mon compte gratuit
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Aucune carte bancaire requise • Démarrez en 2 minutes
            </p>
          </motion.div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
