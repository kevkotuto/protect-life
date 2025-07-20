# 🤖 Guide IA - Langchain + OpenAI pour Protect Life

L'application **Protect Life** intègre maintenant l'**Intelligence Artificielle** avec **Langchain** et **OpenAI** pour offrir des fonctionnalités avancées de sécurité.

## 🚀 **Fonctionnalités IA implémentées**

### **1. Analyse intelligente de signalements**
- ✅ **Détection automatique** du type de danger
- ✅ **Évaluation de la gravité** (faible à critique)
- ✅ **Niveau de confiance** de l'analyse (0-100%)
- ✅ **Justification** de l'analyse
- ✅ **Actions recommandées** pour les citoyens

### **2. Assistant de sécurité contextualisé**
- ✅ **Conseils personnalisés** pour Abidjan
- ✅ **Recommandations par quartier**
- ✅ **Conseils météo/saisonniers**
- ✅ **Sécurité des transports**
- ✅ **Numéros d'urgence** ivoiriens

### **3. Amélioration de contenu**
- ✅ **Optimisation des descriptions** de signalements
- ✅ **Suggestions d'amélioration** automatiques
- ✅ **Adaptation au contexte** d'Abidjan

## 🛠️ **Architecture technique**

### **Services IA créés**

#### **1. ReportAnalyzer (`lib/ai/reportAnalyzer.ts`)**
```typescript
// Analyse un signalement et détermine :
- Type de danger (traffic_accident, fire, crime, etc.)
- Gravité (low, medium, high, critical) 
- Confiance de l'analyse (0-100%)
- Justification détaillée
- Actions recommandées
```

#### **2. SafetyAssistant (`lib/ai/safetyAssistant.ts`)**
```typescript
// Fournit des conseils de sécurité :
- Conseils généraux pour Abidjan
- Conseils par quartier spécifique
- Conseils selon la météo/saison
- Conseils de transport
- Analyse d'urgences
```

#### **3. Configuration (`lib/ai/config.ts`)**
```typescript
// Configuration centralisée :
- Modèles OpenAI (GPT-4o-mini)
- Paramètres (température, tokens)
- Vérification des clés API
- Constantes de l'application
```

### **API Routes créées**

#### **1. `/api/ai/analyze-report`**
- **POST** - Analyse un signalement
- **Entrée** : `{ title, description, location? }`
- **Sortie** : `{ dangerType, severity, confidence, reasoning, suggestedActions }`

#### **2. `/api/ai/enhance-description`**
- **POST** - Améliore une description
- **Entrée** : `{ title, description }`
- **Sortie** : `{ enhanced }`

#### **3. `/api/ai/safety-advice`**
- **POST** - Conseils de sécurité
- **Entrée** : `{ question, location? }`
- **Sortie** : `{ advice }`

## 🎯 **Contexte Côte d'Ivoire**

L'IA est **spécialement entraînée** pour le contexte d'Abidjan :

### **Dangers typiques reconnus**
- **Inondations** - Saison des pluies (mai-octobre)
- **Accidents circulation** - Trafic dense, motos nombreuses
- **Incendies marchés** - Installations précaires
- **Vols à l'arrachée** - Sécurité urbaine
- **Infrastructure dégradée** - Nids de poule, routes
- **Pollution lagune** - Dangers environnementaux

### **Quartiers d'Abidjan pris en compte**
- **Cocody** - Zone résidentielle
- **Plateau** - Centre d'affaires
- **Marcory** - Zone urbaine
- **Adjamé** - Grand marché
- **Koumassi** - Zone populaire
- **Treichville** - Près de la lagune

### **Numéros d'urgence intégrés**
- **Police** : 110 ou 111
- **Pompiers** : 180
- **SAMU** : 185
- **Police Secours** : 170

## 🖥️ **Interface utilisateur**

### **Page Assistant IA (`/assistant`)**
- ✅ **Interface dédiée** pour l'IA
- ✅ **Analyse de signalements** en temps réel
- ✅ **Amélioration de descriptions** automatique
- ✅ **Chat de conseils** de sécurité
- ✅ **Numéros d'urgence** intégrés

### **Composant AIAssistant**
- ✅ **Formulaires intuitifs** pour les analyses
- ✅ **Résultats visuels** avec badges colorés
- ✅ **Loading states** avec animations
- ✅ **Gestion d'erreurs** gracieuse

### **Intégration dans l'app**
- ✅ **Bouton Assistant IA** dans le dashboard
- ✅ **Lien depuis la page d'accueil**
- ✅ **Design cohérent** avec gradient bleu-violet

## 📊 **Exemples d'utilisation**

### **Analyse automatique**
```
Entrée:
- Titre: "Accident sur l'autoroute du Nord"
- Description: "Collision entre deux véhicules"

Sortie IA:
- Type: traffic_accident
- Gravité: high
- Confiance: 95%
- Actions: ["Éviter la zone", "Appeler le 110", "Chercher route alternative"]
```

### **Conseils contextualisés**
```
Question: "Comment éviter les inondations à Koumassi ?"

Réponse IA:
"À Koumassi, pendant la saison des pluies (mai-octobre), évitez le Boulevard Giscard d'Estaing lors de fortes pluies. Surveillez les alertes météo. En cas d'inondation, contactez les pompiers (180). Préférez les axes surélevés comme..."
```

## 🔧 **Configuration et déploiement**

### **Variables d'environnement**
```bash
# .env.local
OPENAI_API_KEY=votre_clé_openai
NEXT_PUBLIC_BYPASS_AUTH=true  # Mode test
```

### **Installation**
```bash
npm install langchain @langchain/openai @langchain/core dotenv
```

### **Activation**
- ✅ **Mode test** : IA activée avec la clé fournie
- ✅ **Fallback gracieux** si clé manquante
- ✅ **Messages d'erreur** informatifs

## 🎛️ **Paramètres IA optimisés**

### **Modèles utilisés**
- **Chat** : `gpt-4o-mini` (temperature: 0.7)
- **Complétion** : `gpt-4o-mini` (temperature: 0.3)

### **Limites configurées**
- **Tokens max** : 1500 (chat), 800 (complétion)
- **Timeout** : 10 secondes
- **Retries** : 3 tentatives
- **Langue** : Français (Côte d'Ivoire)

## 🚀 **Pages et accès**

### **Comment accéder**
1. **Page dédiée** : `http://localhost:3000/assistant`
2. **Depuis dashboard** : Bouton "Assistant IA"
3. **Depuis accueil** : Bouton "Assistant IA"

### **Fonctionnalités testables**
- ✅ **Analyser** : "Feu dans un marché à Cocody"
- ✅ **Améliorer** : Description trop courte/vague
- ✅ **Conseiller** : "Sécurité moto à Abidjan ?"

## 🔮 **Évolutions futures**

### **Fonctionnalités prévues**
- 🔄 **Détection d'images** avec vision IA
- 🔄 **Prédiction de risques** par zone
- 🔄 **Chatbot conversationnel** avancé
- 🔄 **Notifications IA** proactives
- 🔄 **Résumés intelligents** des tendances

### **Améliorations techniques**
- 🔄 **Cache des réponses** IA
- 🔄 **Fine-tuning** sur données locales
- 🔄 **Modèles spécialisés** par type de danger
- 🔄 **API streaming** pour réponses en temps réel

---

**L'IA de Protect Life est maintenant opérationnelle et adaptée au contexte ivoirien ! 🤖🇨🇮**

## 💡 **Conseils d'utilisation**

1. **Soyez spécifique** dans vos descriptions pour une meilleure analyse
2. **Mentionnez le quartier** pour des conseils localisés
3. **Testez l'amélioration** de descriptions pour optimiser vos signalements
4. **Explorez les conseils** par situation (transport, météo, quartier)
5. **Utilisez les numéros d'urgence** fournis par l'IA

**L'assistant IA est là pour améliorer votre sécurité à Abidjan ! 🛡️** 