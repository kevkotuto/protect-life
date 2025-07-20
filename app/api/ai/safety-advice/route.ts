import { NextRequest, NextResponse } from 'next/server';
import { safetyAssistant } from '@/lib/ai/safetyAssistant';
import { aiFallback } from '@/lib/ai/fallback';

export async function POST(request: NextRequest) {
  try {
    const { question, location } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question requise' },
        { status: 400 }
      );
    }

    console.log('🤖 Conseil sécurité IA demandé:', question);

    try {
      // Essayer d'abord l'IA OpenAI
      const advice = await safetyAssistant.getSecurityAdvice(question, location);

      if (advice) {
        return NextResponse.json({ advice });
      }
    } catch (error: any) {
      console.warn('⚠️ API OpenAI indisponible pour conseils, utilisation du fallback:', error.message);
      
      // Si erreur de quota ou API indisponible, utiliser le fallback
      if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('rate')) {
        console.log('🔄 Basculement vers les conseils locaux...');
        
        const advice = aiFallback.getSecurityAdviceFallback(question);
        
        return NextResponse.json({ 
          advice: advice + '\n\n💡 Conseils générés en mode local (API IA temporairement indisponible)',
          fallbackMode: true
        });
      }
      
      throw error;
    }

    // Fallback si pas de résultat
    console.log('🔄 Pas de résultat IA, utilisation du fallback...');
    const advice = aiFallback.getSecurityAdviceFallback(question);
    
    return NextResponse.json({ 
      advice: advice + '\n\n💡 Conseils générés en mode local',
      fallbackMode: true
    });

  } catch (error) {
    console.error('❌ Erreur API conseils:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 