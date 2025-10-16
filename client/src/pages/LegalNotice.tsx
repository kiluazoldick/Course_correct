import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LegalNotice() {
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
                Informations légales
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Mentions légales</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Informations légales relatives à Corrige Tes Cours
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
                  <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
                  <p className="text-muted-foreground mb-2">
                    <strong>Nom de l'entreprise :</strong> Corrige Tes Cours
                  </p>
                  <p className="text-muted-foreground mb-2">
                    <strong>Siège social :</strong> Douala, Cameroun
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Email de contact :</strong> contact@corrigetescours.cm
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
                  <p className="text-muted-foreground mb-2">
                    Le site web Corrige Tes Cours est hébergé par :
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
                  <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
                  <p className="text-muted-foreground mb-4">
                    L'ensemble du contenu de ce site (textes, images, logos, graphiques, interface utilisateur) 
                    est la propriété exclusive de Corrige Tes Cours et est protégé par les lois en vigueur sur 
                    la propriété intellectuelle au Cameroun et internationalement.
                  </p>
                  <p className="text-muted-foreground">
                    Toute reproduction, distribution, modification ou utilisation non autorisée de ce contenu 
                    est strictement interdite et peut faire l'objet de poursuites judiciaires.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Responsabilité</h2>
                  <p className="text-muted-foreground mb-4">
                    Corrige Tes Cours s'efforce de fournir des informations précises, fiables et à jour. 
                    Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité absolue 
                    des informations présentes sur ce site.
                  </p>
                  <p className="text-muted-foreground">
                    L'utilisateur reconnaît utiliser ces informations sous sa propre responsabilité. 
                    Corrige Tes Cours ne saurait être tenu responsable de tout dommage direct ou indirect 
                    résultant de l'utilisation du site ou de l'impossibilité de l'utiliser.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover-elevate transition-all duration-300">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Contact</h2>
                  <p className="text-muted-foreground">
                    Pour toute question ou demande d'information concernant ces mentions légales, 
                    vous pouvez nous contacter à l'adresse : <strong>contact@corrigetescours.cm</strong>
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
