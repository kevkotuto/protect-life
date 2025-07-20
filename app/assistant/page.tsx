'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AssistantPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Rediriger si pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Afficher le chargement pendant l'auth ou la redirection
  if (loading || (!loading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" showText={false} className="justify-center mb-4 animate-pulse" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const handleAnalysisComplete = (analysis: any) => {
    console.log('✅ Analyse terminée:', analysis);
    // Vous pouvez traiter les résultats ici
  };

  const handleDescriptionEnhanced = (enhanced: string) => {
    console.log('✨ Description améliorée:', enhanced);
    // Vous pouvez traiter la description améliorée ici
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
              </Link>
              <Logo size="md" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Bonjour, <span className="font-medium">{user.displayName || 'Utilisateur'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assistant IA Protect Life
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Intelligence artificielle dédiée à votre sécurité à Abidjan. 
            Analysez vos signalements et obtenez des conseils personnalisés.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Analyse intelligente</h3>
            </div>
            <p className="text-gray-600 text-sm">
              L'IA analyse automatiquement vos signalements pour déterminer le type de danger et la gravité, 
              en tenant compte du contexte d'Abidjan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Conseils personnalisés</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Obtenez des conseils de sécurité adaptés à votre situation et votre quartier, 
              avec les numéros d'urgence ivoiriens.
            </p>
          </div>
        </div>

        {/* IA Assistant Component */}
        <AIAssistant 
          onAnalysisComplete={handleAnalysisComplete}
          onDescriptionEnhanced={handleDescriptionEnhanced}
        />

        {/* Emergency Numbers */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            📞 Numéros d'urgence - Côte d'Ivoire
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-red-700">
              <div className="font-medium">Police</div>
              <div>110 ou 111</div>
            </div>
            <div className="text-red-700">
              <div className="font-medium">Pompiers</div>
              <div>180</div>
            </div>
            <div className="text-red-700">
              <div className="font-medium">SAMU</div>
              <div>185</div>
            </div>
            <div className="text-red-700">
              <div className="font-medium">Police Secours</div>
              <div>170</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            💡 Conseils d'utilisation
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Soyez précis dans vos descriptions pour une meilleure analyse IA</li>
            <li>• Mentionnez le quartier d'Abidjan pour des conseils localisés</li>
            <li>• Utilisez l'amélioration de description pour optimiser vos signalements</li>
            <li>• Posez des questions spécifiques sur la sécurité dans votre zone</li>
          </ul>
        </div>
      </main>
    </div>
  );
} 