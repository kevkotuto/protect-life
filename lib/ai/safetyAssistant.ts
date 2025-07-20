import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { chatModel, isAIEnabled } from './config';

interface SafetyAdvice {
  advice: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actions: string[];
  contacts?: string[];
}

// Template pour l'assistant de sécurité
const safetyPrompt = PromptTemplate.fromTemplate(`
Tu es un assistant de sécurité expert pour Abidjan, Côte d'Ivoire. Tu aides les citoyens avec des conseils de sécurité pratiques et localisés.

CONTEXTE ABIDJAN :
- Saison des pluies (mai-octobre) = risques d'inondations
- Circulation dense, motos nombreuses
- Marchés animés (Adjamé, Cocody, Plateau)
- Quartiers résidentiels vs commerciaux
- Lagune Ébrié présente des risques
- Infrastructures parfois dégradées

QUESTION DE L'UTILISATEUR :
{question}

LOCALISATION (si fournie) :
{location}

INSTRUCTIONS :
1. Donne des conseils PRATIQUES et SPÉCIFIQUES à Abidjan
2. Reste concis (maximum 200 mots)
3. Mentionne des numéros d'urgence ivoiriens si pertinent
4. Adapte selon le quartier mentionné
5. Sois rassurant mais réaliste

NUMÉROS D'URGENCE CÔTE D'IVOIRE :
- Police : 110 ou 111
- Pompiers : 180
- SAMU : 185
- Police Secours : 170

Réponds en français simple et accessible.
`);

// Template pour analyser la situation d'urgence
const emergencyPrompt = PromptTemplate.fromTemplate(`
Tu es un expert en gestion d'urgences pour Abidjan, Côte d'Ivoire.

SITUATION RAPPORTÉE :
{situation}

LOCALISATION :
{location}

Évalue la situation et fournis :
1. Niveau d'urgence (low/medium/high/critical)
2. Conseils immédiats (max 3 actions)
3. Numéros à contacter si nécessaire

Réponds UNIQUEMENT en JSON :
{{
  "urgency": "niveau",
  "advice": "conseil_principal",
  "actions": ["action1", "action2", "action3"],
  "contacts": ["numéro1", "numéro2"]
}}
`);

export class SafetyAssistant {
  private safetyChain;
  private emergencyChain;

  constructor() {
    const outputParser = new StringOutputParser();
    this.safetyChain = safetyPrompt.pipe(chatModel).pipe(outputParser);
    this.emergencyChain = emergencyPrompt.pipe(chatModel).pipe(outputParser);
  }

  // Donner des conseils de sécurité généraux
  async getSecurityAdvice(question: string, location?: string): Promise<string | null> {
    if (!isAIEnabled()) {
      return "IA non disponible. Contactez les services d'urgence : Police 110, Pompiers 180, SAMU 185";
    }

    try {
      console.log('🤖 Génération de conseils de sécurité...');
      
      const advice = await this.safetyChain.invoke({
        question: question.trim(),
        location: location || 'Abidjan (quartier non spécifié)'
      });

      return advice.trim();

    } catch (error) {
      console.error('❌ Erreur conseil sécurité:', error);
      return "Erreur lors de la génération des conseils. En cas d'urgence, appelez le 110 (Police) ou 180 (Pompiers).";
    }
  }

  // Analyser une situation d'urgence
  async analyzeEmergency(situation: string, location?: string): Promise<SafetyAdvice | null> {
    if (!isAIEnabled()) return null;

    try {
      console.log('🚨 Analyse d\'urgence IA...');
      
      const result = await this.emergencyChain.invoke({
        situation: situation.trim(),
        location: location || 'Abidjan'
      });

      const cleanedResult = result.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(cleanedResult) as SafetyAdvice;

      return analysis;

    } catch (error) {
      console.error('❌ Erreur analyse urgence:', error);
      return null;
    }
  }

  // Conseils spécifiques par quartier d'Abidjan
  async getNeighborhoodAdvice(neighborhood: string): Promise<string | null> {
    const neighborhoodPrompt = `Donne des conseils de sécurité spécifiques pour le quartier ${neighborhood} à Abidjan. Mentionne les risques connus et les précautions à prendre.`;
    
    return this.getSecurityAdvice(neighborhoodPrompt, neighborhood);
  }

  // Conseils selon la météo/saison
  async getWeatherBasedAdvice(weather: 'dry' | 'rainy' | 'storm'): Promise<string | null> {
    const weatherQuestions = {
      dry: "Quels sont les risques et précautions pendant la saison sèche à Abidjan ?",
      rainy: "Comment se protéger pendant la saison des pluies à Abidjan ? Risques d'inondations ?",
      storm: "Que faire en cas d'orage ou de fortes pluies à Abidjan ?"
    };

    return this.getSecurityAdvice(weatherQuestions[weather]);
  }

  // Conseils pour différents types de transports
  async getTransportSafety(transportType: 'walking' | 'moto' | 'car' | 'taxi'): Promise<string | null> {
    const transportQuestions = {
      walking: "Conseils de sécurité pour se déplacer à pied dans Abidjan",
      moto: "Sécurité moto à Abidjan : précautions et règles importantes",
      car: "Conduire en sécurité à Abidjan : conseils et zones à éviter",
      taxi: "Prendre un taxi en sécurité à Abidjan : conseils pratiques"
    };

    return this.getSecurityAdvice(transportQuestions[transportType]);
  }
}

// Instance globale du service
export const safetyAssistant = new SafetyAssistant(); 