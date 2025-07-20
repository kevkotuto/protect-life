import { NextRequest, NextResponse } from 'next/server';
import { reportAnalyzer } from '@/lib/ai/reportAnalyzer';
import { aiFallback } from '@/lib/ai/fallback';

export async function POST(request: NextRequest) {
  try {
    const { title, description, location } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Titre et description requis' },
        { status: 400 }
      );
    }

    console.log('🤖 Analyse IA demandée:', { title, description });

    try {
      // Essayer d'abord l'IA OpenAI
      const analysis = await reportAnalyzer.analyzeReport(
        title,
        description,
        location
      );

      if (analysis) {
        return NextResponse.json(analysis);
      }
    } catch (error: any) {
      console.warn('⚠️ API OpenAI indisponible, utilisation du mode fallback:', error.message);
      
      // Si erreur de quota ou API indisponible, utiliser le fallback
      if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('rate')) {
        console.log('🔄 Basculement vers l\'analyse locale...');
        
        const fallbackAnalysis = aiFallback.analyzeReportFallback(title, description);
        
        return NextResponse.json({
          ...fallbackAnalysis,
          fallbackMode: true,
          notice: 'Analyse effectuée en mode local (API IA temporairement indisponible)'
        });
      }
      
      throw error; // Re-lancer l'erreur si ce n'est pas un problème de quota
    }

    // Si pas de résultat mais pas d'erreur, utiliser le fallback
    console.log('🔄 Pas de résultat IA, utilisation du fallback...');
    const fallbackAnalysis = aiFallback.analyzeReportFallback(title, description);
    
    return NextResponse.json({
      ...fallbackAnalysis,
      fallbackMode: true,
      notice: 'Analyse effectuée en mode local'
    });

  } catch (error) {
    console.error('❌ Erreur API analyse:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 