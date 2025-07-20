// Service de fallback pour simuler les réponses IA quand l'API n'est pas disponible

interface ReportAnalysis {
  dangerType: string;
  severity: string;
  confidence: number;
  reasoning: string;
  suggestedActions: string[];
}

export class AIFallbackService {
  // Analyse de signalement en mode fallback
  analyzeReportFallback(title: string, description: string): ReportAnalysis {
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    
    // Détection basique du type de danger
    let dangerType = 'other';
    if (titleLower.includes('accident') || titleLower.includes('collision') || descLower.includes('voiture') || descLower.includes('moto')) {
      dangerType = 'traffic_accident';
    } else if (titleLower.includes('feu') || titleLower.includes('incendie') || descLower.includes('fumée') || descLower.includes('brûle')) {
      dangerType = 'fire';
    } else if (titleLower.includes('vol') || titleLower.includes('agression') || descLower.includes('voleur') || descLower.includes('attaque')) {
      dangerType = 'crime';
    } else if (titleLower.includes('urgence') || titleLower.includes('blessé') || descLower.includes('médical') || descLower.includes('ambulance')) {
      dangerType = 'medical_emergency';
    } else if (titleLower.includes('inondation') || titleLower.includes('pluie') || descLower.includes('eau') || descLower.includes('inondé')) {
      dangerType = 'natural_disaster';
    } else if (titleLower.includes('route') || titleLower.includes('trou') || descLower.includes('dégradé') || descLower.includes('cassé')) {
      dangerType = 'infrastructure_issue';
    } else if (titleLower.includes('pollution') || titleLower.includes('odeur') || descLower.includes('déversement')) {
      dangerType = 'environmental_hazard';
    }

    // Détection basique de la gravité
    let severity = 'medium';
    if (descLower.includes('urgent') || descLower.includes('grave') || descLower.includes('critique') || descLower.includes('danger')) {
      severity = 'critical';
    } else if (descLower.includes('important') || descLower.includes('sérieux') || descLower.includes('attention')) {
      severity = 'high';
    } else if (descLower.includes('léger') || descLower.includes('petit') || descLower.includes('mineur')) {
      severity = 'low';
    }

    // Actions suggérées selon le type
    const actionsByType: Record<string, string[]> = {
      traffic_accident: [
        'Éviter la zone si possible',
        'Appeler la police (110)',
        'Chercher un itinéraire alternatif'
      ],
      fire: [
        'Évacuer immédiatement la zone',
        'Appeler les pompiers (180)',
        'Ne pas inhaler la fumée'
      ],
      crime: [
        'Rester vigilant dans le secteur',
        'Signaler à la police (110)',
        'Éviter de se déplacer seul'
      ],
      medical_emergency: [
        'Appeler le SAMU (185)',
        'Ne pas déplacer la victime',
        'Sécuriser les lieux'
      ],
      natural_disaster: [
        'Éviter les zones inondées',
        'Suivre les consignes officielles',
        'Chercher un abri sécurisé'
      ],
      infrastructure_issue: [
        'Signaler aux autorités compétentes',
        'Conduire prudemment',
        'Éviter la zone si dangereuse'
      ],
      environmental_hazard: [
        'Éviter tout contact',
        'Signaler aux autorités',
        'Aérer si en intérieur'
      ],
      other: [
        'Évaluer la situation',
        'Contacter les services appropriés',
        'Rester prudent'
      ]
    };

    const reasoning = this.generateReasoning(dangerType, severity, titleLower, descLower);

    return {
      dangerType,
      severity,
      confidence: 75, // Confiance modérée pour le mode fallback
      reasoning,
      suggestedActions: actionsByType[dangerType] || actionsByType.other
    };
  }

  // Génération de justification
  private generateReasoning(dangerType: string, severity: string, title: string, desc: string): string {
    const reasoningTemplates: Record<string, string> = {
      traffic_accident: `Signalement identifié comme accident de circulation basé sur les mots-clés détectés. Gravité ${severity} selon les termes utilisés.`,
      fire: `Situation d'incendie détectée dans la description. Niveau ${severity} en raison du contexte urbain d'Abidjan.`,
      crime: `Incident de sécurité identifié. Gravité ${severity} typique pour ce type de signalement à Abidjan.`,
      medical_emergency: `Urgence médicale détectée. Niveau ${severity} nécessitant une intervention rapide.`,
      natural_disaster: `Catastrophe naturelle identifiée, probablement liée aux conditions météorologiques à Abidjan.`,
      infrastructure_issue: `Problème d'infrastructure urbaine détecté, fréquent dans certains quartiers d'Abidjan.`,
      environmental_hazard: `Danger environnemental signalé, nécessitant une attention particulière.`,
      other: `Signalement analysé selon les informations disponibles. Classification générale appliquée.`
    };

    return reasoningTemplates[dangerType] || reasoningTemplates.other;
  }

  // Amélioration de description en mode fallback
  enhanceDescriptionFallback(title: string, description: string): string {
    // Améliorations basiques
    let enhanced = description.trim();
    
    // Corrections basiques
    enhanced = enhanced.replace(/\s+/g, ' '); // Espaces multiples
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1); // Majuscule
    
    // Ajout d'informations contextuelles si manquantes
    if (enhanced.length < 50) {
      if (title.toLowerCase().includes('accident')) {
        enhanced += '. Situation nécessitant l\'intervention des services d\'urgence.';
      } else if (title.toLowerCase().includes('feu')) {
        enhanced += '. Risque d\'extension possible, éviter la zone.';
      } else {
        enhanced += '. Signalement en cours de vérification.';
      }
    }

    // Limitation à 200 caractères
    if (enhanced.length > 200) {
      enhanced = enhanced.substring(0, 197) + '...';
    }

    return enhanced;
  }

  // Conseils de sécurité en mode fallback
  getSecurityAdviceFallback(question: string): string {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('inondation')) {
      return `Pour éviter les inondations à Abidjan :
• Surveillez les prévisions météo pendant la saison des pluies (mai-octobre)
• Évitez les zones basses comme certaines parties de Koumassi et Marcory
• En cas d'inondation, appelez les pompiers (180)
• Préférez les axes surélevés lors de fortes pluies
• Stockez de l'eau potable en prévention`;
    }
    
    if (questionLower.includes('transport') || questionLower.includes('moto') || questionLower.includes('voiture')) {
      return `Conseils de transport sécurisé à Abidjan :
• Respectez le code de la route, surtout aux carrefours
• Portez un casque en moto-taxi
• Évitez les heures de pointe (7h-9h, 17h-19h)
• Méfiez-vous des nids de poule sur certaines routes
• En cas d'accident, appelez la police (110)`;
    }
    
    if (questionLower.includes('vol') || questionLower.includes('sécurité')) {
      return `Conseils de sécurité personnelle à Abidjan :
• Évitez d'exposer objets de valeur en public
• Restez vigilant dans les transports et marchés
• Préférez les déplacements en groupe la nuit
• Signaler tout incident suspect à la police (110)
• Gardez toujours une pièce d'identité sur vous`;
    }
    
    return `Conseils généraux de sécurité pour Abidjan :
• Numéros d'urgence : Police 110, Pompiers 180, SAMU 185
• Restez informé des conditions locales
• Évitez les zones à risque identifiées
• Suivez les consignes des autorités
• En cas de doute, contactez les services compétents`;
  }
}

export const aiFallback = new AIFallbackService(); 