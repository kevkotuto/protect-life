'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Report } from '@/types';

// Chargement dynamique du composant carte uniquement côté client
const DynamicInteractiveMap = dynamic(
  () => import('./InteractiveMap').then((mod) => ({ default: mod.InteractiveMap })),
  {
    ssr: false,
    loading: () => null, // Pas de loading ici, on le gère dans le composant principal
  }
);

interface MapWrapperProps {
  reports: Report[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onReportClick?: (report: Report) => void;
  onMarkerVote?: (reportId: string, voteType: 'upvote' | 'downvote' | 'confirm') => void;
}

export function MapWrapper(props: MapWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height: props.height || '500px' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return <DynamicInteractiveMap {...props} />;
} 