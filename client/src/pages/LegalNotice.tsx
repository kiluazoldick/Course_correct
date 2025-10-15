import Navbar from '@/components/Navbar';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';

export default function LegalNotice() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/5 via-background to-background py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Mentions légales</h1>
            <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
              Informations légales relatives à Corrige Tes Cours
            </p>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
                <p className="text-muted-foreground mb-2">
                  <strong>Nom de l'entreprise :</strong> Corrige Tes Cours
                </p>
                <p className="text-muted-foreground mb-2">
                  <strong>Siège social :</strong> Douala, Cameroun
                </p>
                <p className="text-muted-foreground">
                  <strong>Email :</strong> contact@corrigetescours.cm
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
                <p className="text-muted-foreground">
                  Le site Corrige Tes Cours est hébergé par Replit, Inc.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
                <p className="text-muted-foreground mb-4">
                  L'ensemble du contenu de ce site (textes, images, logos, graphiques) est la propriété 
                  exclusive de Corrige Tes Cours et est protégé par les lois en vigueur sur la propriété 
                  intellectuelle.
                </p>
                <p className="text-muted-foreground">
                  Toute reproduction, distribution ou utilisation non autorisée de ce contenu est strictement interdite.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Responsabilité</h2>
                <p className="text-muted-foreground">
                  Corrige Tes Cours s'efforce de fournir des informations précises et à jour. 
                  Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité 
                  des informations présentes sur ce site.
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
