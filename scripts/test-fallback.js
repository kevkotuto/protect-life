// Script de test pour le système de fallback IA
// Usage: node scripts/test-fallback.js

const { aiFallback } = require('../lib/ai/fallback');

console.log('🧪 Test du système de fallback IA\n');

// Test 1: Analyse de signalement
console.log('📊 Test 1: Analyse de signalement');
const analysis = aiFallback.analyzeReportFallback(
  'Accident sur autoroute du Nord',
  'Collision entre deux véhicules près de l\'aéroport, circulation bloquée'
);
console.log('Résultat:', JSON.stringify(analysis, null, 2));
console.log('');

// Test 2: Amélioration de description
console.log('✨ Test 2: Amélioration de description');
const enhanced = aiFallback.enhanceDescriptionFallback(
  'Problème',
  'Ça va pas bien'
);
console.log('Original: "Ça va pas bien"');
console.log('Amélioré:', enhanced);
console.log('');

// Test 3: Conseils de sécurité - Inondations
console.log('🌊 Test 3: Conseils inondations');
const adviceFlood = aiFallback.getSecurityAdviceFallback(
  'Comment éviter les inondations à Koumassi ?'
);
console.log(adviceFlood);
console.log('');

// Test 4: Conseils de sécurité - Transport
console.log('🚗 Test 4: Conseils transport');
const adviceTransport = aiFallback.getSecurityAdviceFallback(
  'Sécurité moto à Abidjan'
);
console.log(adviceTransport);
console.log('');

// Test 5: Différents types de dangers
console.log('🔥 Test 5: Détection types de dangers');
const testCases = [
  { title: 'Incendie marché', desc: 'Feu dans le marché de Cocody' },
  { title: 'Vol téléphone', desc: 'Agression avec vol à Adjamé' },
  { title: 'Urgence médicale', desc: 'Personne blessée, besoin ambulance' },
  { title: 'Route cassée', desc: 'Gros trou sur la route, dangereux' },
  { title: 'Pollution lagune', desc: 'Odeur forte, déversement suspect' }
];

testCases.forEach((testCase, index) => {
  const result = aiFallback.analyzeReportFallback(testCase.title, testCase.desc);
  console.log(`${index + 1}. "${testCase.title}" → Type: ${result.dangerType}, Gravité: ${result.severity}`);
});

console.log('\n✅ Tests du fallback terminés avec succès !');
console.log('📝 Le système de fallback peut remplacer l\'IA OpenAI en cas de problème.'); 