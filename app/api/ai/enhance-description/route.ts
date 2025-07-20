import { NextRequest, NextResponse } from 'next/server';
import { reportAnalyzer } from '@/lib/ai/reportAnalyzer';

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

    const enhanced = await reportAnalyzer.enhanceDescription(title, description);

    if (!enhanced) {
      return NextResponse.json(
        { error: 'Impossible d\'améliorer la description' },
        { status: 500 }
      );
    }

    return NextResponse.json({ enhanced });

  } catch (error) {
    console.error('❌ Erreur API amélioration:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 