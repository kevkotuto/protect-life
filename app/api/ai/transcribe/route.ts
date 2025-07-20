import { NextRequest, NextResponse } from 'next/server';
import { speechTranscription } from '@/lib/ai/speechTranscription';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Fichier audio requis' },
        { status: 400 }
      );
    }

    console.log('🎤 Transcription vocale demandée, taille:', audioFile.size);

    // Vérifier la taille du fichier (max 25MB pour Whisper)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fichier audio trop volumineux (max 25MB)' },
        { status: 400 }
      );
    }

    try {
      // Transcrire avec Whisper + GPT-4o-mini
      const blob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
      const transcriptionResult = await speechTranscription.transcribeAudio(blob);

      if (!transcriptionResult) {
        // Fallback si la transcription échoue
        console.log('🔄 Transcription échouée, utilisation du fallback...');
        const fallbackResult = speechTranscription.generateFallbackTranscription();
        
        return NextResponse.json({
          ...fallbackResult,
          formatted: speechTranscription.formatForReport(fallbackResult)
        });
      }

      // Valider la transcription
      const validation = speechTranscription.validateTranscription(transcriptionResult.improvedText);
      
      if (!validation.isValid) {
        return NextResponse.json(
          { error: 'Transcription invalide ou trop courte' },
          { status: 400 }
        );
      }

      // Formatter pour un signalement
      const formatted = speechTranscription.formatForReport(transcriptionResult);

      return NextResponse.json({
        ...transcriptionResult,
        formatted,
        isValid: validation.isValid
      });

    } catch (error: any) {
      console.error('❌ Erreur lors de la transcription:', error);
      
      // Si erreur de quota ou API indisponible, utiliser le fallback
      if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('rate')) {
        console.log('🔄 Basculement vers le fallback pour transcription...');
        
        const fallbackResult = speechTranscription.generateFallbackTranscription();
        
        return NextResponse.json({
          ...fallbackResult,
          formatted: speechTranscription.formatForReport(fallbackResult),
          notice: 'Transcription vocale temporairement indisponible'
        });
      }
      
      throw error;
    }

  } catch (error) {
    console.error('❌ Erreur API transcription:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 