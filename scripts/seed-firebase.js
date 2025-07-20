// Script pour générer des données de test dans Firebase
// Usage: node scripts/seed-firebase.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, GeoPoint } = require('firebase/firestore');

// Configuration Firebase - remplacez par vos vraies clés
const firebaseConfig = {
  apiKey: "AIzaSyC6HvlXQHI8giacf350k5h3ZHgENQuySuM",
  authDomain: "protect-life-4279a.firebaseapp.com",
  projectId: "protect-life-4279a",
  storageBucket: "protect-life-4279a.firebasestorage.app",
  messagingSenderId: "79724457523",
  appId: "1:79724457523:web:5ac8b5d3d751ca6eb2fd46",
  measurementId: "G-YFMQ8Z1247"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données de test pour les signalements
const sampleReports = [
  {
    userId: "user123",
    dangerType: "traffic_accident",
    severity: "high",
    status: "pending",
    title: "Accident grave sur A6",
    description: "Collision entre deux véhicules sur l'A6 direction Lyon. Embouteillages importants, circulation difficile.",
    location: new GeoPoint(48.8566, 2.3522), // Paris
    images: [],
    upvotes: 15,
    downvotes: 2,
    confirmations: 8,
    metadata: {
      weather: "pluvieux",
      timeOfDay: "matin",
      trafficConditions: "dense"
    }
  },
  {
    userId: "user456",
    dangerType: "fire",
    severity: "critical",
    status: "confirmed",
    title: "Incendie dans un immeuble",
    description: "Feu important dans un immeuble de 5 étages. Les pompiers sont sur place. Évitez le secteur.",
    location: new GeoPoint(48.8606, 2.3376), // Paris - Louvre
    images: [],
    upvotes: 32,
    downvotes: 0,
    confirmations: 25,
    metadata: {
      weather: "sec",
      timeOfDay: "après-midi"
    }
  },
  {
    userId: "user789",
    dangerType: "infrastructure_issue",
    severity: "medium",
    status: "pending",
    title: "Nid de poule dangereux",
    description: "Gros nid de poule sur la chaussée, risque pour les véhicules et motos. Attention!",
    location: new GeoPoint(48.8738, 2.2975), // Paris - Arc de Triomphe
    images: [],
    upvotes: 8,
    downvotes: 1,
    confirmations: 3
  },
  {
    userId: "user321",
    dangerType: "crime",
    severity: "high",
    status: "pending",
    title: "Tentative d'agression",
    description: "Tentative d'agression signalée dans ce secteur. Restez vigilants, évitez les rues sombres.",
    location: new GeoPoint(48.8426, 2.3209), // Paris - Quartier Latin
    images: [],
    upvotes: 22,
    downvotes: 3,
    confirmations: 12
  },
  {
    userId: "user654",
    dangerType: "natural_disaster",
    severity: "medium",
    status: "resolved",
    title: "Inondation route départementale",
    description: "Route inondée suite aux fortes pluies. Circulation rétablie depuis ce matin.",
    location: new GeoPoint(48.8796, 2.3433), // Paris - Montmartre
    images: [],
    upvotes: 18,
    downvotes: 0,
    confirmations: 15
  },
  {
    userId: "user987",
    dangerType: "medical_emergency",
    severity: "critical",
    status: "confirmed",
    title: "Personne en détresse",
    description: "Personne en détresse cardiaque. Les secours sont prévenus et arrivent.",
    location: new GeoPoint(48.8584, 2.2945), // Paris - Tour Eiffel
    images: [],
    upvotes: 45,
    downvotes: 1,
    confirmations: 38
  },
  {
    userId: "user147",
    dangerType: "environmental_hazard",
    severity: "low",
    status: "pending",
    title: "Fuite de gaz odorante",
    description: "Odeur de gaz signalée dans le secteur. GrDF contacté pour vérification.",
    location: new GeoPoint(48.8499, 2.3488), // Paris - Île Saint-Louis
    images: [],
    upvotes: 12,
    downvotes: 0,
    confirmations: 6
  },
  {
    userId: "user258",
    dangerType: "other",
    severity: "low",
    status: "pending",
    title: "Câbles électriques pendant",
    description: "Câbles électriques qui pendent dangereusement après la tempête d'hier.",
    location: new GeoPoint(48.8466, 2.3467), // Paris - Notre-Dame
    images: [],
    upvotes: 9,
    downvotes: 0,
    confirmations: 4
  }
];

// Données de test pour les utilisateurs
const sampleUsers = [
  {
    phoneNumber: "+33612345678",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    role: "user",
    reputation: 85,
    reportsCount: 3,
    confirmedReportsCount: 2,
    isActive: true,
    preferences: {
      notifications: true,
      emailNotifications: false,
      pushNotifications: true,
      language: "fr",
      theme: "light"
    }
  },
  {
    phoneNumber: "+33623456789",
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@email.com",
    role: "user",
    reputation: 120,
    reportsCount: 7,
    confirmedReportsCount: 6,
    isActive: true,
    preferences: {
      notifications: true,
      emailNotifications: true,
      pushNotifications: true,
      language: "fr",
      theme: "dark"
    }
  },
  {
    phoneNumber: "+33634567890",
    firstName: "Pierre",
    lastName: "Durand",
    role: "moderator",
    reputation: 200,
    reportsCount: 15,
    confirmedReportsCount: 14,
    isActive: true,
    preferences: {
      notifications: true,
      emailNotifications: true,
      pushNotifications: true,
      language: "fr",
      theme: "light"
    }
  }
];

// Fonction pour ajouter les signalements
async function seedReports() {
  console.log('🔄 Création des signalements...');
  
  try {
    for (const report of sampleReports) {
      const docRef = await addDoc(collection(db, 'reports'), {
        ...report,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Signalement créé: ${docRef.id} - ${report.title}`);
    }
    console.log(`🎉 ${sampleReports.length} signalements créés avec succès!`);
  } catch (error) {
    console.error('❌ Erreur lors de la création des signalements:', error);
  }
}

// Fonction pour ajouter les utilisateurs
async function seedUsers() {
  console.log('🔄 Création des utilisateurs...');
  
  try {
    for (const user of sampleUsers) {
      const docRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Utilisateur créé: ${docRef.id} - ${user.firstName} ${user.lastName}`);
    }
    console.log(`🎉 ${sampleUsers.length} utilisateurs créés avec succès!`);
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
  }
}

// Fonction principale
async function seedDatabase() {
  console.log('🚀 Démarrage du seeding Firebase...');
  console.log('📱 Projet:', firebaseConfig.projectId);
  
  await seedUsers();
  await seedReports();
  
  console.log('✨ Seeding terminé!');
  console.log('🔍 Vérifiez votre console Firebase pour voir les données');
  
  process.exit(0);
}

// Exécuter le script
seedDatabase().catch(console.error); 