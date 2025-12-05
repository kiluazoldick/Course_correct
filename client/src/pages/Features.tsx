import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import SEO from '@/components/SEO';
import { FileText, Brain, CheckCircle, TrendingUp, Sparkles, Target, Upload, MessageCircle, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Features() {
  const { t } = useLanguage();

  const featureIcons = [FileText, Brain, Upload, CheckCircle, MessageCircle, Sparkles, TrendingUp, BarChart3, Target];
  const featureKeys = ['notes', 'summaries', 'upload', 'quiz', 'tariq', 'evaluation', 'tracking', 'advancedStats', 'revision'] as const;
  
  const features = featureKeys.map((key, index) => ({
    icon: featureIcons[index],
    title: t.featuresPage.features[key].title,
    description: t.featuresPage.features[key].description,
    details: t.featuresPage.features[key].details
  }));

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
        title={t.featuresPage.heroTitle}
        description={t.featuresPage.heroSubtitle}
        url="https://corrigetescours.com/features"
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
                <Zap className="w-4 h-4" />
                {t.featuresPage.badge}
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-features-hero-title">
              {t.featuresPage.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t.featuresPage.heroSubtitle}
            </p>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full hover-elevate transition-all duration-300" data-testid={`card-feature-${index}`}>
                    <CardContent className="p-6">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.featuresPage.ctaTitle}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t.featuresPage.ctaSubtitle}
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8" data-testid="button-signup-cta">
                {t.featuresPage.ctaButton}
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
