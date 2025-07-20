import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/Logo';
import { AlertTriangle, Users, MapPin, Phone, Camera, Bot } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <Link href="/login">
              <Button className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Logo size="xl" showText={false} className="justify-center mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Protégez votre communauté
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Signalez les dangers, partagez des alertes en temps réel et aidez votre communauté à rester en sécurité. 
              Ensemble, nous créons un environnement plus sûr pour tous.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="flex items-center gap-2 px-8 py-3">
                <AlertTriangle className="h-5 w-5" />
                Signaler un danger
              </Button>
            </Link>
            <Link href="/assistant">
              <Button variant="outline" size="lg" className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100">
                <Bot className="h-5 w-5 text-blue-600" />
                Assistant IA
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" size="lg" className="flex items-center gap-2 px-8 py-3">
                <MapPin className="h-5 w-5" />
                Voir la carte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne
            </h2>
            <p className="text-lg text-gray-600">
              Trois étapes simples pour protéger votre communauté
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>1. Observez</CardTitle>
                <CardDescription>
                  Repérez un danger ou une situation à risque dans votre environnement
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>2. Signalez</CardTitle>
                <CardDescription>
                  Créez un signalement avec photos, description et localisation GPS
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>3. Partagez</CardTitle>
                <CardDescription>
                  Votre signalement aide toute la communauté à éviter le danger
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Ensemble, nous faisons la différence
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1,000+</div>
              <div className="text-blue-100">Signalements</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Dangers résolus</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Surveillance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à protéger votre communauté ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Rejoignez des milliers d'utilisateurs qui font de leur quartier un endroit plus sûr.
          </p>
          <Link href="/login">
            <Button size="lg" className="flex items-center gap-2 px-8 py-3">
              <Phone className="h-5 w-5" />
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="md" textClassName="text-white text-xl" />
              </div>
              <p className="text-gray-400">
                Application communautaire pour signaler les dangers et protéger votre environnement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Une urgence ? Contactez immédiatement les services d'urgence.
              </p>
              <p className="text-gray-400 mt-2">
                <strong>Police :</strong> 17<br />
                <strong>Pompiers :</strong> 18<br />
                <strong>SAMU :</strong> 15
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Sécurité</h3>
              <p className="text-gray-400">
                Vos données sont protégées et votre anonymat respecté.
                Nous ne partageons jamais vos informations personnelles.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Protect Life. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
