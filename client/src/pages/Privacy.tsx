import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Privacy() {
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
                <Shield className="w-4 h-4" />
                {t.privacyPage.badge}
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.privacyPage.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.privacyPage.subtitle}
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
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.collection.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.privacyPage.collection.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.privacyPage.collection.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.usage.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.privacyPage.usage.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.privacyPage.usage.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.protection.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.privacyPage.protection.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.privacyPage.protection.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.ai.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.privacyPage.ai.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.privacyPage.ai.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    <strong>{t.privacyPage.ai.important}</strong> {t.privacyPage.ai.notice}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.rights.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.privacyPage.rights.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>{t.privacyPage.rights.access}</strong> {t.privacyPage.rights.accessDesc}</li>
                    <li><strong>{t.privacyPage.rights.rectification}</strong> {t.privacyPage.rights.rectificationDesc}</li>
                    <li><strong>{t.privacyPage.rights.deletion}</strong> {t.privacyPage.rights.deletionDesc}</li>
                    <li><strong>{t.privacyPage.rights.portability}</strong> {t.privacyPage.rights.portabilityDesc}</li>
                    <li><strong>{t.privacyPage.rights.opposition}</strong> {t.privacyPage.rights.oppositionDesc}</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    {t.privacyPage.rights.contact} <strong>contact@corrigetescours.cm</strong>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.cookies.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {t.privacyPage.cookies.intro}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {t.privacyPage.cookies.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    {t.privacyPage.cookies.notice}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.retention.title}</h2>
                  <p className="text-muted-foreground">
                    {t.privacyPage.retention.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.changes.title}</h2>
                  <p className="text-muted-foreground">
                    {t.privacyPage.changes.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{t.privacyPage.contact.title}</h2>
                  <p className="text-muted-foreground">
                    {t.privacyPage.contact.description} <strong>contact@corrigetescours.cm</strong>
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
