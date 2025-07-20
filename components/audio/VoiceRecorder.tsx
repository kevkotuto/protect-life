'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Play, Pause, Trash2, Upload, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscriptionComplete?: (transcription: {
    originalText: string;
    improvedText: string;
    confidence: number;
    formatted: { title: string; description: string };
  }) => void;
  onError?: (error: string) => void;
}

export function VoiceRecorder({ onTranscriptionComplete, onError }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Demander les permissions micro au montage
  useEffect(() => {
    requestMicrophonePermission();
    return () => {
      // Nettoyer les ressources
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      // Fermer le stream immédiatement, on le recréera pour l'enregistrement
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Erreur permission microphone:', error);
      setHasPermission(false);
      onError?.('Permission microphone refusée. Veuillez autoriser l\'accès au microphone.');
    }
  };

  const startRecording = async () => {
    if (!hasPermission) {
      await requestMicrophonePermission();
      if (!hasPermission) return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Arrêter le stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Timer pour afficher la durée
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error);
      onError?.('Impossible de démarrer l\'enregistrement. Vérifiez vos permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      onError?.('Aucun enregistrement à transcrire');
      return;
    }

    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de transcription');
      }

      const result = await response.json();
      
      onTranscriptionComplete?.(result);
      
      // Nettoyer l'enregistrement après transcription réussie
      deleteRecording();

    } catch (error) {
      console.error('Erreur transcription:', error);
      onError?.(error instanceof Error ? error.message : 'Erreur lors de la transcription');
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasPermission) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Mic className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">Permission microphone requise</p>
              <p className="text-xs text-orange-600">Cliquez pour autoriser l'accès au microphone</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={requestMicrophonePermission}
              className="ml-auto"
            >
              Autoriser
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Signalement vocal</span>
            {isRecording && (
              <Badge variant="outline" className="bg-red-100 text-red-800 animate-pulse">
                ● REC {formatTime(recordingTime)}
              </Badge>
            )}
          </div>

          {/* Contrôles d'enregistrement */}
          {!audioBlob && (
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Mic className="h-4 w-4" />
                  Commencer l'enregistrement
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  variant="outline"
                  className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Square className="h-4 w-4" />
                  Arrêter ({formatTime(recordingTime)})
                </Button>
              )}
            </div>
          )}

          {/* Lecteur audio */}
          {audioBlob && audioUrl && (
            <div className="space-y-3">
              <audio 
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={playAudio}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Écouter'}
                </Button>
                
                <Badge variant="outline" className="text-xs">
                  {formatTime(recordingTime)} enregistré
                </Badge>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={deleteRecording}
                  className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Bouton de transcription */}
              <Button 
                onClick={transcribeAudio}
                disabled={isTranscribing}
                className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Transcription en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Transcrire et utiliser
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-blue-600 space-y-1">
            <p>• Parlez clairement en français</p>
            <p>• Mentionnez le lieu à Abidjan si possible</p>
            <p>• Décrivez la situation de manière concise</p>
            <p>• Durée recommandée : 10-60 secondes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 