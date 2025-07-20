import { NextRequest, NextResponse } from 'next/server';
import { reportAnalyzer } from '@/lib/ai/reportAnalyzer';
import { aiFallback } from '@/lib/ai/fallback';

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Titre et description requis' },
        { status: 400 }
      );
    }

    console.log('🤖 Amélioration description IA demandée');

    try {
      // Essayer d'abord l'IA OpenAI
      const enhanced = await reportAnalyzer.enhanceDescription(title, description);

      if (enhanced) {
        return NextResponse.json({ enhanced });
      }
    } catch (error: any) {
      console.warn('⚠️ API OpenAI indisponible pour amélioration, utilisation du fallback:', error.message);
      
      // Si erreur de quota ou API indisponible, utiliser le fallback
      if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('rate')) {
        console.log('🔄 Basculement vers l\'amélioration locale...');
        
        const enhanced = aiFallback.enhanceDescriptionFallback(title, description);
        
        return NextResponse.json({ 
          enhanced,
          fallbackMode: true,
          notice: 'Amélioration effectuée en mode local (API IA temporairement indisponible)'
        });
      }
      
      throw error;
    }

    // Fallback si pas de résultat
    console.log('🔄 Pas de résultat IA, utilisation du fallback...');
    const enhanced = aiFallback.enhanceDescriptionFallback(title, description);
    
    return NextResponse.json({ 
      enhanced,
      fallbackMode: true,
      notice: 'Amélioration effectuée en mode local'
    });

  } catch (error) {
    console.error('❌ Erreur API amélioration:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 