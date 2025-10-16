import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Privacy() {
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
                Protection des données
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Politique de confidentialité</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comment nous protégeons et utilisons vos données personnelles
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
                  <h2 className="text-2xl font-bold mb-4">Collecte des données</h2>
                  <p className="text-muted-foreground mb-4">
                    Nous collectons uniquement les données nécessaires au fonctionnement de notre service :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Nom et prénom (pour personnaliser votre expérience)</li>
                    <li>Adresse email (pour la connexion et les communications)</li>
                    <li>Contenus de cours que vous créez ou uploadez</li>
                    <li>Résultats de quiz et statistiques de progression</li>
                    <li>Historique de conversations avec Tariq IA</li>
                    <li>Informations de paiement (traitées de manière sécurisée via Lygos)</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Utilisation des données</h2>
                  <p className="text-muted-foreground mb-4">
                    Vos données personnelles sont utilisées exclusivement pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Créer et gérer votre compte utilisateur</li>
                    <li>Fournir nos services (résumés IA, quiz, Tariq IA, suivi de progression)</li>
                    <li>Traiter vos paiements de manière sécurisée</li>
                    <li>Améliorer notre plateforme et nos algorithmes (de manière anonymisée)</li>
                    <li>Vous contacter concernant votre compte, nos services ou mises à jour importantes</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Protection des données</h2>
                  <p className="text-muted-foreground mb-4">
                    Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Chiffrement SSL/TLS pour toutes les communications</li>
                    <li>Hachage sécurisé des mots de passe (bcrypt)</li>
                    <li>Accès sécurisé à votre compte avec authentification Google disponible</li>
                    <li>Stockage sécurisé dans des bases de données protégées (PostgreSQL via Neon)</li>
                    <li>Pas de partage de vos données personnelles avec des tiers à des fins commerciales</li>
                    <li>Serveurs hébergés dans des infrastructures certifiées</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Intelligence Artificielle</h2>
                  <p className="text-muted-foreground mb-4">
                    Nos services IA (résumés, quiz, Tariq IA) traitent votre contenu pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Générer des résumés pertinents de vos cours</li>
                    <li>Créer des quiz personnalisés adaptés à votre contenu</li>
                    <li>Répondre à vos questions via Tariq IA</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    <strong>Important :</strong> Vos cours et conversations restent privés. Nous n'utilisons pas 
                    votre contenu pour entraîner des modèles d'IA publics. Le traitement est effectué uniquement 
                    pour vous fournir nos services.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Vos droits</h2>
                  <p className="text-muted-foreground mb-4">
                    Conformément aux réglementations sur la protection des données, vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Droit d'accès :</strong> Consulter vos données personnelles à tout moment</li>
                    <li><strong>Droit de rectification :</strong> Corriger vos données inexactes ou incomplètes</li>
                    <li><strong>Droit de suppression :</strong> Supprimer votre compte et toutes vos données</li>
                    <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format exploitable</li>
                    <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Pour exercer ces droits, contactez-nous à : <strong>contact@corrigetescours.cm</strong>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Cookies et technologies similaires</h2>
                  <p className="text-muted-foreground mb-4">
                    Notre site utilise des cookies essentiels pour :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Maintenir votre session de connexion active</li>
                    <li>Mémoriser vos préférences (mode sombre/clair, langue)</li>
                    <li>Assurer la sécurité de votre compte</li>
                    <li>Améliorer les performances et l'expérience utilisateur</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités 
                    du site pourraient ne pas fonctionner correctement.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Conservation des données</h2>
                  <p className="text-muted-foreground">
                    Nous conservons vos données personnelles aussi longtemps que votre compte est actif ou 
                    selon les besoins de fourniture de nos services. Si vous supprimez votre compte, toutes 
                    vos données personnelles seront définitivement effacées dans un délai de 30 jours.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Modifications de la politique</h2>
                  <p className="text-muted-foreground">
                    Nous pouvons mettre à jour cette politique de confidentialité occasionnellement. 
                    Nous vous informerons de tout changement important par email ou via une notification 
                    sur la plateforme. La version actuelle sera toujours disponible sur cette page.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Contact</h2>
                  <p className="text-muted-foreground">
                    Pour toute question concernant cette politique de confidentialité ou le traitement de vos données, 
                    contactez-nous à : <strong>contact@corrigetescours.cm</strong>
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
