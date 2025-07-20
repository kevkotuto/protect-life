import OpenAI from 'openai';
import { chatModel, isAIEnabled } from './config';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Configuration OpenAI pour Whisper
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TranscriptionResult {
  originalText: string;
  improvedText: string;
  confidence: number;
  language: string;
  fallbackMode?: boolean;
}

// Template pour améliorer les transcriptions
const transcriptionImprovementPrompt = PromptTemplate.fromTemplate(`
Tu es un expert en amélioration de transcriptions vocales pour des signalements d'urgence à Abidjan, Côte d'Ivoire.

TRANSCRIPTION ORIGINALE :
{originalText}

CONTEXTE :
- Signalement d'urgence ou de sécurité
- Peut contenir des noms de lieux d'Abidjan (Cocody, Plateau, Adjamé, Marcory, Koumassi, Treichville)
- Peut contenir des termes en français ivoirien
- Peut avoir des erreurs de transcription automatique

INSTRUCTIONS :
1. Corrige les erreurs de transcription évidents
2. Améliore la clarté et la structure
3. Préserve le sens original
4. Adapte le vocabulaire au contexte d'urgence
5. Corrige les noms de lieux d'Abidjan si mal transcrits
6. Garde un style direct et informatif
7. Maximum 200 mots

EXEMPLES DE CORRECTIONS :
- "je vois de la fumée" → "Je vois de la fumée"
- "kokodie" → "Cocody"  
- "il y a un problème" → "Il y a un accident/incident"

Réponds UNIQUEMENT avec le texte amélioré, sans guillemets ni formatage.
`);

export class SpeechTranscriptionService {
  private improvementChain;

  constructor() {
    const outputParser = new StringOutputParser();
    this.improvementChain = transcriptionImprovementPrompt.pipe(chatModel).pipe(outputParser);
  }

  // Transcrire un fichier audio avec Whisper
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult | null> {
    if (!isAIEnabled()) {
      console.log('🎤 IA désactivée - transcription indisponible');
      return null;
    }

    try {
      console.log('🎤 Transcription audio avec Whisper...');

      // Créer un File à partir du Blob
      const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

      // Transcrire avec Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'fr', // Français
        prompt: 'Signalement d\'urgence à Abidjan, Côte d\'Ivoire. Quartiers: Cocody, Plateau, Adjamé, Marcory, Koumassi, Treichville.',
      });

      const originalText = transcription.text;
      console.log('✅ Transcription Whisper terminée:', originalText);

      // Améliorer la transcription avec GPT-4o-mini
      let improvedText = originalText;
      try {
        console.log('🤖 Amélioration de la transcription avec GPT-4o-mini...');
        improvedText = await this.improvementChain.invoke({
          originalText: originalText
        });
        console.log('✅ Amélioration terminée:', improvedText);
      } catch (error) {
        console.warn('⚠️ Erreur amélioration transcription, utilisation du texte original:', error);
        improvedText = originalText;
      }

      return {
        originalText,
        improvedText: improvedText.trim(),
        confidence: 90, // Whisper a généralement une bonne précision
        language: 'fr'
      };

    } catch (error) {
      console.error('❌ Erreur lors de la transcription:', error);
      return null;
    }
  }

  // Fallback simple pour quand l'API n'est pas disponible
  generateFallbackTranscription(): TranscriptionResult {
    return {
      originalText: 'Transcription vocale indisponible',
      improvedText: 'La transcription vocale n\'est pas disponible actuellement. Veuillez saisir votre signalement manuellement.',
      confidence: 0,
      language: 'fr',
      fallbackMode: true
    };
  }

  // Valider et nettoyer une transcription
  validateTranscription(text: string): { isValid: boolean; cleanedText: string } {
    const cleaned = text.trim();
    
    // Vérifications basiques
    const isValid = cleaned.length > 5 && 
                   cleaned.length < 1000 && 
                   !cleaned.toLowerCase().includes('transcription failed');

    return {
      isValid,
      cleanedText: cleaned
    };
  }

  // Détecter la langue de la transcription (basique)
  detectLanguage(text: string): string {
    const frenchWords = ['le', 'la', 'les', 'un', 'une', 'est', 'sont', 'dans', 'sur', 'avec', 'pour'];
    const englishWords = ['the', 'and', 'is', 'are', 'in', 'on', 'with', 'for'];
    
    const words = text.toLowerCase().split(' ');
    
    const frenchCount = words.filter(word => frenchWords.includes(word)).length;
    const englishCount = words.filter(word => englishWords.includes(word)).length;
    
    return frenchCount > englishCount ? 'fr' : 'en';
  }

  // Formatter la transcription pour un signalement
  formatForReport(transcription: TranscriptionResult): { title: string; description: string } {
    const text = transcription.improvedText;
    
    // Essayer d'extraire un titre (premier bout de phrase)
    const sentences = text.split(/[.!?]+/);
    let title = sentences[0]?.trim() || 'Signalement vocal';
    
    // Limiter le titre à 50 caractères
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    // La description est le texte complet
    let description = text;
    
    // Ajouter des informations contextuelles si la transcription est courte
    if (description.length < 20) {
      description += ' (Signalement transmis par message vocal)';
    }
    
    return {
      title: title || 'Signalement vocal',
      description
    };
  }
}

export const speechTranscription = new SpeechTranscriptionService(); 