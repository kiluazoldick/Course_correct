import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Heart, Target, Users, Zap, Sparkles, BookOpen, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Notre mission",
      description: "Rendre l'apprentissage plus efficace et accessible à tous les étudiants camerounais grâce à l'intelligence artificielle."
    },
    {
      icon: Heart,
      title: "Notre passion",
      description: "Aider les étudiants à réussir en leur fournissant des outils simples qui facilitent la compréhension et la mémorisation."
    },
    {
      icon: Zap,
      title: "Notre approche",
      description: "Des outils intelligents qui s'adaptent à votre rythme et votre style d'apprentissage pour des révisions ultra-efficaces."
    },
    {
      icon: Users,
      title: "Notre communauté",
      description: "Des milliers d'étudiants à Douala et partout au Cameroun nous font confiance pour améliorer leurs résultats académiques."
    }
  ];

  const stats = [
    { value: "5 000+", label: "Étudiants actifs" },
    { value: "90%", label: "Taux de satisfaction" },
    { value: "50 000+", label: "Résumés générés" },
    { value: "4.8/5", label: "Note moyenne" }
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
                <BookOpen className="w-4 h-4" />
                Notre histoire
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-about-title">
              À propos de Corrige Tes Cours
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Nous croyons que chaque étudiant camerounais mérite les meilleurs outils pour réussir ses études
            </p>
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

        {/* Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-16 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Notre histoire</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Corrige Tes Cours est né d'un constat simple : les étudiants camerounais passent trop de temps 
                à réviser sans vraiment progresser. Face aux longues heures de lecture et aux notes difficiles à retenir, 
                nous avons voulu créer une solution.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Notre plateforme utilise l'intelligence artificielle pour transformer vos cours en résumés clairs, 
                générer des quiz personnalisés, et vous accompagner avec Tariq IA, votre tuteur personnel disponible 24/7.
              </p>
              <p className="text-lg text-muted-foreground">
                Aujourd'hui, des milliers d'étudiants à Douala et partout au Cameroun améliorent leurs résultats 
                grâce à Corrige Tes Cours. Et ce n'est que le début !
              </p>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {values.map((value, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover-elevate transition-all duration-300" data-testid={`card-value-${index}`}>
                    <CardContent className="p-6">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Notre engagement envers vous</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nous travaillons chaque jour pour améliorer notre plateforme et vous offrir 
                la meilleure expérience d'apprentissage possible. Votre réussite est notre priorité absolue.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div variants={itemVariants}>
                <Card className="h-full hover-elevate transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Innovation continue</h3>
                    <p className="text-sm text-muted-foreground">
                      Nous améliorons constamment nos algorithmes IA pour vous offrir les meilleurs résumés et quiz
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full hover-elevate transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Écoute active</h3>
                    <p className="text-sm text-muted-foreground">
                      Vos retours façonnent notre plateforme. Nous sommes à votre écoute pour mieux vous servir
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full hover-elevate transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Excellence académique</h3>
                    <p className="text-sm text-muted-foreground">
                      Notre mission est de vous aider à exceller dans vos études et atteindre vos objectifs
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Rejoignez des milliers d'étudiants qui réussissent
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Commencez dès aujourd'hui et transformez votre façon d'apprendre
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8" data-testid="button-signup-cta">
                Créer un compte gratuit
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
