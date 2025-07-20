import { ChatOpenAI } from '@langchain/openai';

// Configuration du modèle OpenAI pour les chats
export const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1500,
});

// Configuration du modèle OpenAI pour la complétion
export const completionModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o-mini',
  temperature: 0.3,
  maxTokens: 800,
});

// Vérifier que la clé API est configurée
export const isAIEnabled = () => {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key';
};

// Constantes pour l'IA
export const AI_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT: 10000, // 10 secondes
  DEFAULT_LANGUAGE: 'fr', // Français par défaut pour la Côte d'Ivoire
} as const; 