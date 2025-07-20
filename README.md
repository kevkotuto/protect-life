# 🛡️ Protect Life - Application de Signalement de Dangers

Application web communautaire pour signaler et partager les dangers en temps réel, construite avec Next.js 14 et Firebase.

## ✨ Fonctionnalités

- **🔐 Authentification SMS** - Connexion sécurisée par numéro de téléphone
- **📍 Géolocalisation** - Localisation automatique des dangers
- **📸 Upload d'images** - Ajout de photos pour illustrer les signalements
- **🗺️ Interface intuitive** - Design moderne avec shadcn/ui
- **⚡ Temps réel** - Partage instantané des alertes
- **👥 Communautaire** - Vote et confirmation par la communauté

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- Compte Firebase
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd protect
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Firebase**
   - Créez un projet Firebase
   - Activez l'authentification par téléphone
   - Créez une base Firestore
   - Activez Firebase Storage

4. **Variables d'environnement**
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📱 Comment utiliser l'application

### 1. Connexion
- Rendez-vous sur `/login`
- Entrez votre numéro de téléphone au format international (+33...)
- Saisissez le code reçu par SMS

### 2. Créer un signalement
- Cliquez sur "Signaler un danger"
- Choisissez le type et la gravité du danger
- Ajoutez un titre et une description
- Prenez des photos (optionnel)
- Autorisez la géolocalisation
- Publiez le signalement

### 3. Voir les signalements
- Consultez la liste des dangers dans votre région
- Votez pour confirmer ou contester un signalement
- Aidez votre communauté à rester informée

## 🏗️ Architecture technique

### Stack technologique
- **Frontend**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State Management**: TanStack Query
- **Validation**: Zod + React Hook Form
- **TypeScript**: Pour la sécurité des types

### Structure du projet
```
src/
├── app/                     # Pages Next.js (App Router)
│   ├── dashboard/          # Interface principale
│   ├── login/              # Authentification
│   └── providers.tsx       # Providers React
├── components/             # Composants réutilisables
│   ├── ui/                 # Composants shadcn/ui
│   ├── auth/               # Authentification
│   └── reports/            # Signalements
├── lib/                    # Services et utilitaires
│   └── firebase/           # Configuration Firebase
├── hooks/                  # Hooks personnalisés
└── types/                  # Types TypeScript
```

## 🔧 Configuration Firebase

### Règles Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reports - lecture publique, écriture authentifiée
    match /reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Votes - gestion par utilisateur connecté
    match /reportVotes/{voteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Sécurité Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚨 Types de dangers supportés

- 🚗 **Accident de circulation**
- 🔥 **Incendie**
- 🚑 **Urgence médicale**
- 🚨 **Crime/Vol**
- 🌪️ **Catastrophe naturelle**
- 🏗️ **Problème d'infrastructure**
- ☣️ **Danger environnemental**
- ⚠️ **Autre**

## 📊 Niveaux de gravité

- 🟢 **Faible** - Information générale
- 🟡 **Moyen** - Attention recommandée
- 🟠 **Élevé** - Éviter la zone
- 🔴 **Critique** - Danger immédiat

## 🛡️ Sécurité et confidentialité

- Authentification sécurisée par SMS
- Données chiffrées en transit et au repos
- Géolocalisation anonymisée
- Pas de stockage d'informations personnelles
- Modération communautaire

## 🚀 Déploiement

### Vercel (recommandé)
```bash
npm run build
vercel --prod
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support d'urgence

⚠️ **IMPORTANT**: Cette application ne remplace pas les services d'urgence officiels.

En cas d'urgence immédiate, contactez:
- **Police**: 17
- **Pompiers**: 18
- **SAMU**: 15
- **Numéro européen d'urgence**: 112

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework
- [Firebase](https://firebase.google.com/) pour l'infrastructure
- [shadcn/ui](https://ui.shadcn.com/) pour les composants
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- La communauté open source

---

**Protect Life** - Ensemble, protégeons notre communauté 🛡️
