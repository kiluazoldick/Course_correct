import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import SEO from '@/components/SEO';
import { Check, Sparkles, Zap, Shield, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t.pricingPage.free.name,
      price: "0",
      period: t.pricingPage.free.period,
      description: t.pricingPage.free.description,
      features: t.pricingPage.free.features,
      cta: t.pricingPage.free.cta,
      popular: false
    },
    {
      name: t.pricingPage.premium.name,
      price: "500",
      period: t.pricingPage.premium.period,
      description: t.pricingPage.premium.description,
      features: t.pricingPage.premium.features,
      cta: t.pricingPage.premium.cta,
      popular: true
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: t.pricingPage.benefits.fast.title,
      description: t.pricingPage.benefits.fast.description
    },
    {
      icon: Shield,
      title: t.pricingPage.benefits.guarantee.title,
      description: t.pricingPage.benefits.guarantee.description
    },
    {
      icon: Clock,
      title: t.pricingPage.benefits.support.title,
      description: t.pricingPage.benefits.support.description
    },
    {
      icon: TrendingUp,
      title: t.pricingPage.benefits.progress.title,
      description: t.pricingPage.benefits.progress.description
    }
  ];

  const faqItems = [
    { question: t.pricingPage.faq.q1.question, answer: t.pricingPage.faq.q1.answer },
    { question: t.pricingPage.faq.q2.question, answer: t.pricingPage.faq.q2.answer },
    { question: t.pricingPage.faq.q3.question, answer: t.pricingPage.faq.q3.answer },
    { question: t.pricingPage.faq.q4.question, answer: t.pricingPage.faq.q4.answer },
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
        title={t.pricingPage.heroTitle}
        description={t.pricingPage.heroSubtitle}
        url="https://corrigetescours.com/pricing"
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
                {t.pricingPage.badge}
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-pricing-title">
              {t.pricingPage.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t.pricingPage.heroSubtitle}
            </p>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {plans.map((plan, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card 
                    className={`relative h-full hover-elevate transition-all duration-300 ${plan.popular ? 'border-primary shadow-xl shadow-primary/5' : ''}`}
                    data-testid={`card-plan-${index}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary" data-testid="badge-popular">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {t.pricingPage.mostPopular}
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground ml-2">XAF /{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/signup">
                        <Button 
                          variant={plan.popular ? "default" : "outline"}
                          className="w-full"
                          size="lg"
                          data-testid={`button-select-plan-${index}`}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20"
            >
              <h2 className="text-3xl font-bold mb-12 text-center">{t.pricingPage.benefits.title}</h2>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {benefits.map((benefit, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full hover-elevate transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <benefit.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20 text-center"
            >
              <h2 className="text-3xl font-bold mb-12">{t.pricingPage.faq.title}</h2>
              <div className="max-w-3xl mx-auto grid gap-8 text-left">
                {faqItems.map((item, index) => (
                  <Card key={index} className="hover-elevate transition-all duration-300">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{item.question}</h3>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
