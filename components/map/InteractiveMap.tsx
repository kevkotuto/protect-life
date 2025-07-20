'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { Report } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ThumbsUp, ThumbsDown, CheckCircle, AlertTriangle } from 'lucide-react';

// Import des styles CSS de Leaflet
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  reports: Report[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onReportClick?: (report: Report) => void;
  onMarkerVote?: (reportId: string, voteType: 'upvote' | 'downvote' | 'confirm') => void;
}

// Couleurs selon le niveau de gravité
const severityColors = {
  low: '#10B981',      // Vert
  medium: '#F59E0B',   // Jaune
  high: '#F97316',     // Orange
  critical: '#EF4444'  // Rouge
};

// Icônes selon le type de danger
const dangerIcons = {
  traffic_accident: '🚗',
  fire: '🔥',
  medical_emergency: '🚑',
  crime: '🚨',
  natural_disaster: '🌪️',
  infrastructure_issue: '🏗️',
  environmental_hazard: '☣️',
  other: '⚠️',
};

// Créer une icône personnalisée pour chaque signalement
const createCustomIcon = (report: Report) => {
  const color = severityColors[report.severity];
  const emoji = dangerIcons[report.dangerType] || '⚠️';
  
  return divIcon({
    html: `
      <div class="custom-marker" style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Fonction pour obtenir le label du type de danger
const getDangerTypeLabel = (dangerType: string) => {
  const labels: Record<string, string> = {
    traffic_accident: 'Accident de circulation',
    fire: 'Incendie',
    medical_emergency: 'Urgence médicale',
    crime: 'Crime/Vol',
    natural_disaster: 'Catastrophe naturelle',
    infrastructure_issue: 'Problème d\'infrastructure',
    environmental_hazard: 'Danger environnemental',
    other: 'Autre',
  };
  return labels[dangerType] || 'Inconnu';
};

// Fonction pour obtenir le label de gravité
const getSeverityLabel = (severity: string) => {
  const labels: Record<string, string> = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    critical: 'Critique',
  };
  return labels[severity] || 'Inconnu';
};

// Fonction pour obtenir le label de statut
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    resolved: 'Résolu',
    false_alarm: 'Fausse alerte',
    expired: 'Expiré',
  };
  return labels[status] || 'Inconnu';
};

export function InteractiveMap({ 
  reports, 
  center = [48.8566, 2.3522], // Paris par défaut
  zoom = 12,
  height = '500px',
  onReportClick,
  onMarkerVote 
}: InteractiveMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // S'assurer que nous sommes côté client
    if (typeof window !== 'undefined') {
      setMapLoaded(true);
    }
  }, []);

  if (!mapLoaded) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        {/* Couche de tuiles OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueurs pour chaque signalement */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.latitude, report.location.longitude]}
            icon={createCustomIcon(report)}
            eventHandlers={{
              click: () => {
                onReportClick?.(report);
              },
            }}
          >
            <Popup 
              maxWidth={350}
              className="custom-popup"
            >
              <div className="p-2 min-w-[300px]">
                {/* En-tête avec titre et statut */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 pr-2">
                    {report.title}
                  </h3>
                                     <Badge 
                     variant="outline" 
                     className={`ml-2 ${
                       report.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                       report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                       report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                       'bg-yellow-100 text-yellow-800'
                     }`}
                   >
                    {getStatusLabel(report.status)}
                  </Badge>
                </div>

                {/* Badges type et gravité */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="bg-gray-100">
                    {dangerIcons[report.dangerType]} {getDangerTypeLabel(report.dangerType)}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${
                      report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {getSeverityLabel(report.severity)}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {report.description}
                </p>

                {/* Localisation */}
                {report.location.address && (
                  <p className="text-gray-600 text-xs mb-3 flex items-center gap-1">
                    📍 {report.location.address}
                  </p>
                )}

                {/* Heure */}
                <p className="text-gray-500 text-xs mb-3">
                  🕒 {formatDistanceToNow(report.createdAt, { addSuffix: true, locale: fr })}
                </p>

                {/* Actions de vote */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkerVote?.(report.id, 'upvote');
                    }}
                    className="flex items-center gap-1 text-green-600 hover:bg-green-50"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {report.upvotes}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkerVote?.(report.id, 'downvote');
                    }}
                    className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    {report.downvotes}
                  </Button>

                  {report.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkerVote?.(report.id, 'confirm');
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:bg-blue-50"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Confirmer ({report.confirmations})
                    </Button>
                  )}
                </div>

                {/* Indicateur critique */}
                {report.severity === 'critical' && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-xs flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Danger critique - Intervention immédiate recommandée
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Styles CSS personnalisés pour les marqueurs */}
      <style jsx global>{`
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        
        .custom-marker:hover {
          transform: scale(1.1);
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .leaflet-popup-tip {
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
} 