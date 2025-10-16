import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Terms() {
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
                Conditions d'utilisation
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Conditions Générales d'Utilisation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Règles d'utilisation de Corrige Tes Cours
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
                  <h2 className="text-2xl font-bold mb-4">1. Acceptation des conditions</h2>
                  <p className="text-muted-foreground">
                    En accédant et en utilisant Corrige Tes Cours, vous acceptez d'être lié par ces conditions 
                    générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">2. Description du service</h2>
                  <p className="text-muted-foreground mb-4">
                    Corrige Tes Cours est une plateforme d'apprentissage en ligne qui propose :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>La prise de notes et l'organisation de cours</li>
                    <li>L'upload de fichiers PDF et Word (2/mois gratuit, illimité en Premium)</li>
                    <li>La génération automatique de résumés par IA</li>
                    <li>La création de quiz personnalisés</li>
                    <li>L'assistance de Tariq IA, votre tuteur personnel</li>
                    <li>Le suivi de progression académique</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">3. Compte utilisateur</h2>
                  <p className="text-muted-foreground mb-4">
                    Pour utiliser nos services, vous devez :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Créer un compte avec des informations exactes et à jour</li>
                    <li>Maintenir la confidentialité de vos identifiants</li>
                    <li>Être responsable de toutes les activités effectuées depuis votre compte</li>
                    <li>Nous informer immédiatement de toute utilisation non autorisée</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">4. Utilisation acceptable</h2>
                  <p className="text-muted-foreground mb-4">
                    Vous vous engagez à ne pas :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Utiliser le service à des fins illégales ou non autorisées</li>
                    <li>Partager votre compte avec d'autres personnes</li>
                    <li>Tenter d'accéder aux comptes d'autres utilisateurs</li>
                    <li>Perturber ou interférer avec le bon fonctionnement du service</li>
                    <li>Copier, reproduire ou distribuer le contenu du service sans autorisation</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">5. Propriété du contenu</h2>
                  <p className="text-muted-foreground mb-4">
                    Vous conservez tous les droits sur le contenu que vous créez (cours, notes). 
                    En utilisant notre service, vous nous accordez une licence pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Stocker et traiter votre contenu de manière sécurisée</li>
                    <li>Générer des résumés et quiz à partir de votre contenu</li>
                    <li>Améliorer nos services (de manière anonymisée)</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">6. Paiements et abonnements</h2>
                  <p className="text-muted-foreground mb-4">
                    Pour les plans payants :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Les prix sont indiqués en Francs CFA (XAF) - Premium : 1 500 XAF/mois</li>
                    <li>Le paiement se fait par Mobile Money (MTN, Orange) ou carte bancaire via Lygos</li>
                    <li>Vous pouvez annuler votre abonnement à tout moment</li>
                    <li>Garantie satisfait ou remboursé de 14 jours sur le plan Premium</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">7. Limitation de responsabilité</h2>
                  <p className="text-muted-foreground">
                    Corrige Tes Cours est fourni "tel quel". Nous ne garantissons pas que le service sera 
                    toujours disponible, sécurisé ou exempt d'erreurs. Nous déclinons toute responsabilité 
                    pour les dommages directs ou indirects résultant de l'utilisation de notre service.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">8. Modifications des CGU</h2>
                  <p className="text-muted-foreground">
                    Nous nous réservons le droit de modifier ces conditions à tout moment. 
                    Les modifications entrent en vigueur dès leur publication sur cette page. 
                    Votre utilisation continue du service après ces modifications constitue votre acceptation des nouvelles conditions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
                  <p className="text-muted-foreground">
                    Pour toute question concernant ces conditions, contactez-nous à : <strong>contact@corrigetescours.cm</strong>
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
