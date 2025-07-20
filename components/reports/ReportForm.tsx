'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { toast } from 'sonner';
import { MapPin, AlertTriangle, Camera, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { firestoreService } from '@/lib/firebase/firestore';
import { LocationData } from '@/types';

const reportSchema = z.object({
  dangerType: z.enum([
    'traffic_accident',
    'fire',
    'medical_emergency',
    'crime',
    'natural_disaster',
    'infrastructure_issue',
    'environmental_hazard',
    'other'
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(5, 'Le titre doit faire au moins 5 caractères').max(100),
  description: z.string().min(10, 'La description doit faire au moins 10 caractères').max(1000),
  address: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

const dangerTypes = [
  { value: 'traffic_accident', label: '🚗 Accident de circulation', icon: '🚗' },
  { value: 'fire', label: '🔥 Incendie', icon: '🔥' },
  { value: 'medical_emergency', label: '🚑 Urgence médicale', icon: '🚑' },
  { value: 'crime', label: '🚨 Crime/Vol', icon: '🚨' },
  { value: 'natural_disaster', label: '🌪️ Catastrophe naturelle', icon: '🌪️' },
  { value: 'infrastructure_issue', label: '🏗️ Problème d\'infrastructure', icon: '🏗️' },
  { value: 'environmental_hazard', label: '☣️ Danger environnemental', icon: '☣️' },
  { value: 'other', label: '⚠️ Autre', icon: '⚠️' },
];

const severityLevels = [
  { value: 'low', label: 'Faible', color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'medium', label: 'Moyen', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { value: 'high', label: 'Élevé', color: 'text-orange-600', bg: 'bg-orange-100' },
  { value: 'critical', label: 'Critique', color: 'text-red-600', bg: 'bg-red-100' },
];

interface ReportFormProps {
  onSuccess?: () => void;
}

export function ReportForm({ onSuccess }: ReportFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useAuth();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      dangerType: 'other',
      severity: 'medium',
      title: '',
      description: '',
      address: '',
    },
  });

  // Obtenir la géolocalisation
  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.error('Géolocalisation non supportée');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
        toast.success('Position obtenue !');
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Impossible d\'obtenir votre position');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 600000,
      }
    );
  };

  // Obtenir automatiquement la position au chargement
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const onSubmit = async (data: ReportFormData) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!location) {
      toast.error('Position requise pour créer un signalement');
      return;
    }

    setSubmitting(true);

    try {
      // Créer le signalement dans Firestore
      const reportData = {
        userId: user.uid,
        dangerType: data.dangerType,
        severity: data.severity,
        status: 'pending' as const,
        title: data.title,
        description: data.description,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: data.address || undefined,
        },
        images: [], // TODO: Upload images to Firebase Storage
        upvotes: 0,
        downvotes: 0,
        confirmations: 0,
      };

      await firestoreService.createReport(reportData);
      
      toast.success('Signalement créé avec succès !');
      form.reset();
      setImages([]);
      setLocation(null);
      onSuccess?.();
      
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Erreur lors de la création du signalement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          Signaler un danger
        </CardTitle>
        <CardDescription>
          Aidez votre communauté en signalant les dangers que vous observez
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Type de danger */}
            <FormField
              control={form.control}
              name="dangerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de danger</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de danger" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dangerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Niveau de gravité */}
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau de gravité</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez la gravité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className={`px-2 py-1 rounded text-sm ${level.bg} ${level.color}`}>
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Titre */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du signalement</FormLabel>
                  <FormControl>
                    <Input placeholder="Décrivez brièvement le danger..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Un titre court et descriptif (5-100 caractères)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez en détail la situation, ce que vous avez observé..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Plus d'informations aideront les autres utilisateurs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Adresse */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Rue, ville..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Ajoutez une adresse pour aider à localiser le danger
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Géolocalisation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Position GPS</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  {locationLoading ? 'Localisation...' : 'Obtenir ma position'}
                </Button>
                {location && (
                  <span className="text-sm text-green-600">
                    ✓ Position obtenue
                  </span>
                )}
              </div>
            </div>

            {/* Upload d'images */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos du danger (optionnel)
              </label>
              <ImageUpload
                value={images}
                onChange={setImages}
                maxFiles={5}
                disabled={submitting}
              />
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              disabled={submitting || !location}
              className="w-full flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Création...' : 'Créer le signalement'}
            </Button>
            
            {!location && (
              <p className="text-sm text-orange-600 text-center">
                ⚠️ Position GPS requise pour créer un signalement
              </p>
            )}
            
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 