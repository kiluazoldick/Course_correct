import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LegalNotice() {
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
                <Scale className="w-4 h-4" />
                {t.legalPage.badge}
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.legalPage.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.legalPage.subtitle}
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
                  <h2 className="text-2xl font-bold mb-4">{t.legalPage.editor.title}</h2>
                  <p className="text-muted-foreground mb-2">
                    <strong>{t.legalPage.editor.company} :</strong> Corrige Tes Cours
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>{t.legalPage.editor.address} :</strong> Douala, Cameroun
                  </p>
                  <p className="text-muted-foreground">
                    <strong>{t.legalPage.editor.email} :</strong> contact@corrigetescours.cm
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.legalPage.hosting.title}</h2>
                  <p className="text-muted-foreground mb-2">
                    {t.legalPage.hosting.description}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Replit, Inc.</strong><br />
                    321 Castro Street, Mountain View, CA 94041, United States
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.legalPage.intellectual.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.legalPage.intellectual.p1}
                  </p>
                  <p className="text-muted-foreground">
                    {t.legalPage.intellectual.p2}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.legalPage.responsibility.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.legalPage.responsibility.p1}
                  </p>
                  <p className="text-muted-foreground">
                    {t.legalPage.responsibility.p2}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.legalPage.contact.title}</h2>
                  <p className="text-muted-foreground">
                    {t.legalPage.contact.description} <strong>contact@corrigetescours.cm</strong>
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
