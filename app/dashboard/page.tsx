'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportCard } from '@/components/reports/ReportCard';
import { ReportForm } from '@/components/reports/ReportForm';
import { MapWrapper } from '@/components/map/MapWrapper';
import { useAuth } from '@/hooks/useAuth';
import { firestoreService } from '@/lib/firebase/firestore';
import { Logo } from '@/components/ui/Logo';
import { Shield, Plus, MapIcon, List, AlertTriangle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // Rediriger si pas connecté avec useEffect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => firestoreService.getReports({ limit: 20 }),
    enabled: !!user,
  });

  const reports = reportsData?.reports || [];

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    // La query se rafraîchira automatiquement
  };

  const handleMapVote = async (reportId: string, voteType: 'upvote' | 'downvote' | 'confirm') => {
    if (!user) {
      return;
    }

    try {
      // En mode test, on simule juste l'action
      if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
        console.log('🧪 Mock vote depuis la carte:', reportId, voteType);
        // TODO: Mettre à jour les données mockées si nécessaire
        return;
      }
      
      // TODO: Implémenter le vote réel quand Firebase sera configuré
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  };

  const handleReportClick = (report: any) => {
    console.log('Signalement cliqué:', report);
    // TODO: Ouvrir un modal avec les détails du signalement
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <Link href="/map">
                <Button variant="outline" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  Carte plein écran
                </Button>
              </Link>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Signaler un danger
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer un signalement</DialogTitle>
                  </DialogHeader>
                  <ReportForm onSuccess={handleCreateSuccess} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={signOut}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total signalements</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 depuis hier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Nécessitent confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critiques</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.severity === 'critical').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Intervention urgente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Résolus</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'resolved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Dangers traités
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapIcon className="h-4 w-4" />
              Carte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Logo size="lg" showText={false} className="justify-center mb-4 animate-pulse opacity-60" />
                <p className="text-gray-500">Chargement des signalements...</p>
              </div>
            ) : reports.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun signalement
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Soyez le premier à signaler un danger dans votre communauté.
                  </p>
                  <Button 
                    onClick={() => setCreateDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Créer un signalement
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {reports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onClick={() => {
                      // TODO: Naviguer vers la page de détail du signalement
                      console.log('Navigate to report:', report.id);
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardContent className="p-0">
                <MapWrapper
                  reports={reports}
                  center={[5.3600, -4.0083]} // Abidjan, Côte d'Ivoire
                  zoom={12}
                  height="600px"
                  onReportClick={handleReportClick}
                  onMarkerVote={handleMapVote}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 