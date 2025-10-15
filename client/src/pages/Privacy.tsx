import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 via-background to-background py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Politique de confidentialité</h1>
            <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
              Comment nous protégeons et utilisons vos données personnelles
            </p>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Collecte des données</h2>
                <p className="text-muted-foreground mb-4">
                  Nous collectons uniquement les données nécessaires au fonctionnement de notre service :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Contenus de cours que vous créez</li>
                  <li>Résultats de quiz et statistiques de progression</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Utilisation des données</h2>
                <p className="text-muted-foreground mb-4">
                  Vos données personnelles sont utilisées pour :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Créer et gérer votre compte utilisateur</li>
                  <li>Fournir nos services (résumés IA, quiz, suivi de progression)</li>
                  <li>Améliorer notre plateforme</li>
                  <li>Vous contacter concernant votre compte ou nos services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Protection des données</h2>
                <p className="text-muted-foreground mb-4">
                  Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Chiffrement des données sensibles</li>
                  <li>Accès sécurisé à votre compte</li>
                  <li>Stockage sécurisé dans des bases de données protégées</li>
                  <li>Pas de partage de vos données avec des tiers sans votre consentement</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Vos droits</h2>
                <p className="text-muted-foreground mb-4">
                  Vous disposez des droits suivants concernant vos données :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification de vos données</li>
                  <li>Droit de suppression de votre compte et de vos données</li>
                  <li>Droit à la portabilité de vos données</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Pour exercer ces droits, contactez-nous à : contact@corrigetescours.cm
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                <p className="text-muted-foreground">
                  Notre site utilise des cookies essentiels pour assurer le bon fonctionnement de votre 
                  session et améliorer votre expérience utilisateur. Vous pouvez configurer votre navigateur 
                  pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne pas fonctionner correctement.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
