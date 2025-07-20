'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Calendar,
  User
} from 'lucide-react';
import { Report } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReportCardProps {
  report: Report;
  onVote?: (reportId: string, voteType: 'upvote' | 'downvote' | 'confirm') => void;
  onClick?: () => void;
}

const dangerTypeLabels: Record<string, { label: string; icon: string; color: string }> = {
  traffic_accident: { label: 'Accident de circulation', icon: '🚗', color: 'bg-red-100 text-red-800' },
  fire: { label: 'Incendie', icon: '🔥', color: 'bg-red-100 text-red-800' },
  medical_emergency: { label: 'Urgence médicale', icon: '🚑', color: 'bg-red-100 text-red-800' },
  crime: { label: 'Crime/Vol', icon: '🚨', color: 'bg-purple-100 text-purple-800' },
  natural_disaster: { label: 'Catastrophe naturelle', icon: '🌪️', color: 'bg-orange-100 text-orange-800' },
  infrastructure_issue: { label: 'Problème d\'infrastructure', icon: '🏗️', color: 'bg-yellow-100 text-yellow-800' },
  environmental_hazard: { label: 'Danger environnemental', icon: '☣️', color: 'bg-green-100 text-green-800' },
  other: { label: 'Autre', icon: '⚠️', color: 'bg-gray-100 text-gray-800' },
};

const severityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Faible', color: 'text-green-700', bgColor: 'bg-green-100' },
  medium: { label: 'Moyen', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  high: { label: 'Élevé', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  critical: { label: 'Critique', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: '⏳' },
  confirmed: { label: 'Confirmé', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: '✅' },
  resolved: { label: 'Résolu', color: 'text-green-700', bgColor: 'bg-green-100', icon: '✅' },
  false_alarm: { label: 'Fausse alerte', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: '❌' },
  expired: { label: 'Expiré', color: 'text-gray-500', bgColor: 'bg-gray-50', icon: '🕒' },
};

export function ReportCard({ report, onVote, onClick }: ReportCardProps) {
  const [voting, setVoting] = useState(false);
  const { user } = useAuth();

  const dangerType = dangerTypeLabels[report.dangerType] || dangerTypeLabels.other;
  const severity = severityConfig[report.severity] || severityConfig.medium;
  const status = statusConfig[report.status] || statusConfig.pending;

  const handleVote = async (voteType: 'upvote' | 'downvote' | 'confirm') => {
    if (!user) {
      toast.error('Vous devez être connecté pour voter');
      return;
    }

    if (voting) return;

    setVoting(true);
    try {
      await onVote?.(report.id, voteType);
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Erreur lors du vote');
    } finally {
      setVoting(false);
    }
  };

  const timeAgo = formatDistanceToNow(report.createdAt, { 
    addSuffix: true, 
    locale: fr 
  });

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer ${
        report.severity === 'critical' ? 'border-red-300' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{dangerType.icon}</div>
            <div>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={dangerType.color}>
                  {dangerType.label}
                </Badge>
                <Badge variant="outline" className={`${severity.bgColor} ${severity.color}`}>
                  {severity.label}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${status.bgColor} ${status.color} flex items-center gap-1`}
          >
            <span>{status.icon}</span>
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed">
          {report.description}
        </p>

        {/* Localisation */}
        {(report.location.address || report.location.latitude) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {report.location.address || 
             `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`}
          </div>
        )}

        {/* Images */}
        {report.images && report.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {report.images.slice(0, 3).map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 2 && report.images.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium">
                    +{report.images.length - 3}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Separator />

        {/* Statistiques et actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {timeAgo}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Utilisateur
            </div>
          </div>

          {/* Actions de vote */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVote('upvote');
              }}
              disabled={voting}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              {report.upvotes}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVote('downvote');
              }}
              disabled={voting}
              className="flex items-center gap-1"
            >
              <ThumbsDown className="h-4 w-4" />
              {report.downvotes}
            </Button>

            {report.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleVote('confirm');
                }}
                disabled={voting}
                className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmer ({report.confirmations})
              </Button>
            )}
          </div>
        </div>

        {/* Indicateur de gravité critique */}
        {report.severity === 'critical' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium text-sm">
              Danger critique - Intervention immédiate recommandée
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 