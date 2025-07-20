import { NextRequest, NextResponse } from 'next/server';
import { reportAnalyzer } from '@/lib/ai/reportAnalyzer';

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

    const analysis = await reportAnalyzer.analyzeReport(
      title,
      description,
      location
    );

    if (!analysis) {
      return NextResponse.json(
        { error: 'Impossible d\'analyser le signalement' },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('❌ Erreur API analyse:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 