import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Terms() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="inline-block mb-6"
            >
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t.termsPage.badge}
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.termsPage.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.termsPage.subtitle}
            </p>
          </motion.div>

          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.acceptance.title}</h2>
                  <p className="text-muted-foreground">
                    {t.termsPage.acceptance.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.service.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.termsPage.service.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.termsPage.service.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.account.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.termsPage.account.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.termsPage.account.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.acceptable.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.termsPage.acceptable.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.termsPage.acceptable.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.content.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.termsPage.content.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.termsPage.content.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.payment.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.termsPage.payment.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.termsPage.payment.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.liability.title}</h2>
                  <p className="text-muted-foreground">
                    {t.termsPage.liability.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.modifications.title}</h2>
                  <p className="text-muted-foreground">
                    {t.termsPage.modifications.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.termsPage.contact.title}</h2>
                  <p className="text-muted-foreground">
                    {t.termsPage.contact.description} <strong>contact@corrigetescours.cm</strong>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
