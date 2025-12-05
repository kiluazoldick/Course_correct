import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import SEO from '@/components/SEO';
import { Heart, Target, Users, Zap, BookOpen, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Target,
      title: t.aboutPage.values.mission.title,
      description: t.aboutPage.values.mission.description
    },
    {
      icon: Heart,
      title: t.aboutPage.values.passion.title,
      description: t.aboutPage.values.passion.description
    },
    {
      icon: Zap,
      title: t.aboutPage.values.approach.title,
      description: t.aboutPage.values.approach.description
    },
    {
      icon: Users,
      title: t.aboutPage.values.community.title,
      description: t.aboutPage.values.community.description
    }
  ];

  const stats = [
    { value: "5 000+", label: t.aboutPage.stats.students },
    { value: "90%", label: t.aboutPage.stats.satisfaction },
    { value: "50 000+", label: t.aboutPage.stats.summaries },
    { value: "4.8/5", label: t.aboutPage.stats.rating }
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
        title={t.aboutPage.heroTitle}
        description={t.aboutPage.heroSubtitle}
        url="https://corrigetescours.com/about"
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
                <BookOpen className="w-4 h-4" />
                {t.aboutPage.badge}
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-about-title">
              {t.aboutPage.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t.aboutPage.heroSubtitle}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.aboutPage.story.title}</h2>
              <p className="text-lg text-muted-foreground mb-4">
                {t.aboutPage.story.p1}
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                {t.aboutPage.story.p2}
              </p>
              <p className="text-lg text-muted-foreground">
                {t.aboutPage.story.p3}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.aboutPage.commitment.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.aboutPage.commitment.subtitle}
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
                    <h3 className="font-semibold mb-2">{t.aboutPage.commitment.innovation.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.aboutPage.commitment.innovation.description}
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
                    <h3 className="font-semibold mb-2">{t.aboutPage.commitment.listening.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.aboutPage.commitment.listening.description}
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
                    <h3 className="font-semibold mb-2">{t.aboutPage.commitment.excellence.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.aboutPage.commitment.excellence.description}
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
              {t.aboutPage.cta.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t.aboutPage.cta.subtitle}
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8" data-testid="button-signup-cta">
                {t.aboutPage.cta.button}
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
