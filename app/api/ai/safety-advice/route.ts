import { NextRequest, NextResponse } from 'next/server';
import { safetyAssistant } from '@/lib/ai/safetyAssistant';

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

    const advice = await safetyAssistant.getSecurityAdvice(question, location);

    if (!advice) {
      return NextResponse.json(
        { error: 'Impossible de générer des conseils' },
        { status: 500 }
      );
    }

    return NextResponse.json({ advice });

  } catch (error) {
    console.error('❌ Erreur API conseils:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 