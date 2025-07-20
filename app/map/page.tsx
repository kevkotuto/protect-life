'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapWrapper } from '@/components/map/MapWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { firestoreService } from '@/lib/firebase/firestore';
import { ArrowLeft, Filter, Layers, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MapPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { user, loading } = useAuth();
  const router = useRouter();

  // Rediriger si pas connecté avec useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports', selectedType, selectedSeverity],
    queryFn: () => firestoreService.getReports({ 
      limit: 100,
      ...(selectedType !== 'all' && { dangerType: selectedType }),
      ...(selectedSeverity !== 'all' && { severity: selectedSeverity })
    }),
    enabled: !!user,
  });

  const reports = reportsData?.reports || [];

  const handleMapVote = async (reportId: string, voteType: 'upvote' | 'downvote' | 'confirm') => {
    if (!user) return;

    try {
      if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
        console.log('🧪 Mock vote depuis la carte:', reportId, voteType);
        return;
      }
      // TODO: Implémenter le vote réel
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  };

  const handleReportClick = (report: any) => {
    console.log('Signalement cliqué:', report);
    // TODO: Ouvrir un modal avec les détails
  };

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

  const dangerTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'traffic_accident', label: '🚗 Accidents de circulation' },
    { value: 'fire', label: '🔥 Incendies' },
    { value: 'medical_emergency', label: '🚑 Urgences médicales' },
    { value: 'crime', label: '🚨 Crimes/Vols' },
    { value: 'natural_disaster', label: '🌪️ Catastrophes naturelles' },
    { value: 'infrastructure_issue', label: '🏗️ Problèmes d\'infrastructure' },
    { value: 'environmental_hazard', label: '☣️ Dangers environnementaux' },
    { value: 'other', label: '⚠️ Autres' },
  ];

  const severityLevels = [
    { value: 'all', label: 'Toutes les gravités' },
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyen' },
    { value: 'high', label: 'Élevé' },
    { value: 'critical', label: 'Critique' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b z-50 relative">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">{reports.length}</span> signalement{reports.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Filtres */}
          {filtersOpen && (
            <div className="pb-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de danger
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dangerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau de gravité
                  </label>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une gravité" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Carte en plein écran */}
      <main className="flex-1">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Logo size="lg" showText={false} className="justify-center mb-4 animate-pulse opacity-60" />
              <p className="text-gray-500">Chargement de la carte...</p>
            </div>
          </div>
        ) : (
          <MapWrapper
            reports={reports}
            center={[48.8566, 2.3522]} // Paris
            zoom={12}
            height="calc(100vh - 80px)"
            onReportClick={handleReportClick}
            onMarkerVote={handleMapVote}
          />
        )}
      </main>

      {/* Légende flottante */}
      <div className="absolute bottom-4 left-4 z-50">
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Légende
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Faible</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Moyen</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span>Élevé</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Critique</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 