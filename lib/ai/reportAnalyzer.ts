import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { chatModel, isAIEnabled } from './config';
import { Report } from '@/types';

interface ReportAnalysis {
  dangerType: string;
  severity: string;
  confidence: number;
  reasoning: string;
  suggestedActions?: string[];
}

// Template pour analyser un signalement
const analysisPrompt = PromptTemplate.fromTemplate(`
Tu es un expert en sécurité publique pour Abidjan, Côte d'Ivoire. Analyse ce signalement et détermine :

SIGNALEMENT :
Titre: {title}
Description: {description}
Localisation: {location}

TYPES DE DANGERS POSSIBLES :
- traffic_accident (accidents de circulation)
- fire (incendies)
- medical_emergency (urgences médicales)
- crime (crimes/vols)
- natural_disaster (catastrophes naturelles)
- infrastructure_issue (problèmes d'infrastructure)
- environmental_hazard (dangers environnementaux)
- other (autres)

NIVEAUX DE GRAVITÉ :
- low (faible - danger mineur)
- medium (moyen - attention recommandée)
- high (élevé - éviter la zone)
- critical (critique - danger immédiat)

ANALYSE DEMANDÉE :
1. Type de danger le plus probable
2. Niveau de gravité approprié
3. Niveau de confiance (0-100%)
4. Justification de ton analyse
5. Actions recommandées pour les citoyens

CONTEXTE CÔTE D'IVOIRE :
- Saison des pluies = inondations fréquentes
- Marchés = risques d'incendie
- Routes = infrastructure parfois dégradée
- Sécurité urbaine = vols à l'arrachée possibles

Réponds UNIQUEMENT en JSON avec ce format exact :
{{
  "dangerType": "type_identifié",
  "severity": "niveau_gravité",
  "confidence": nombre_entre_0_et_100,
  "reasoning": "explication_courte",
  "suggestedActions": ["action1", "action2", "action3"]
}}
`);

export class ReportAnalyzer {
  private chain;

  constructor() {
    const outputParser = new StringOutputParser();
    this.chain = analysisPrompt.pipe(chatModel).pipe(outputParser);
  }

  async analyzeReport(
    title: string, 
    description: string, 
    location?: string
  ): Promise<ReportAnalysis | null> {
    if (!isAIEnabled()) {
      console.log('🤖 IA désactivée - analyse manuelle requise');
      return null;
    }

    try {
      console.log('🤖 Analyse IA du signalement...');
      
      const result = await this.chain.invoke({
        title: title.trim(),
        description: description.trim(),
        location: location || 'Non spécifiée'
      });

      // Parser la réponse JSON
      const cleanedResult = result.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(cleanedResult) as ReportAnalysis;

      // Validation des résultats
      if (this.validateAnalysis(analysis)) {
        console.log('✅ Analyse IA terminée:', analysis.dangerType, analysis.severity);
        return analysis;
      } else {
        console.error('❌ Analyse IA invalide');
        return null;
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse IA:', error);
      return null;
    }
  }

  private validateAnalysis(analysis: any): analysis is ReportAnalysis {
    const validDangerTypes = [
      'traffic_accident', 'fire', 'medical_emergency', 'crime',
      'natural_disaster', 'infrastructure_issue', 'environmental_hazard', 'other'
    ];
    
    const validSeverities = ['low', 'medium', 'high', 'critical'];

    return (
      analysis &&
      typeof analysis.dangerType === 'string' &&
      validDangerTypes.includes(analysis.dangerType) &&
      typeof analysis.severity === 'string' &&
      validSeverities.includes(analysis.severity) &&
      typeof analysis.confidence === 'number' &&
      analysis.confidence >= 0 && analysis.confidence <= 100 &&
      typeof analysis.reasoning === 'string' &&
      Array.isArray(analysis.suggestedActions)
    );
  }

  // Analyser et suggérer des améliorations pour une description
  async enhanceDescription(title: string, description: string): Promise<string | null> {
    if (!isAIEnabled()) return null;

    const enhancePrompt = PromptTemplate.fromTemplate(`
Tu es un expert en rédaction de signalements d'urgence pour Abidjan, Côte d'Ivoire.

SIGNALEMENT ACTUEL :
Titre: {title}
Description: {description}

AMÉLIORE cette description pour la rendre :
1. Plus claire et précise
2. Plus utile pour les premiers secours
3. Adaptée au contexte ivoirien
4. Limitée à 200 caractères maximum

Garde le même sens mais améliore la formulation.
Réponds UNIQUEMENT avec la description améliorée, sans guillemets ni formatage.
`);

    try {
      const enhanceChain = enhancePrompt.pipe(chatModel).pipe(new StringOutputParser());
      const enhanced = await enhanceChain.invoke({ title, description });
      
      return enhanced.trim();
    } catch (error) {
      console.error('❌ Erreur amélioration description:', error);
      return null;
    }
  }
}

// Instance globale du service
export const reportAnalyzer = new ReportAnalyzer(); 