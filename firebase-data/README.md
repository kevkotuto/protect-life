# 🔥 Configuration Firebase pour Protect Life

Ce dossier contient toutes les données et configurations nécessaires pour configurer Firebase avec l'application Protect Life.

## 📋 Contenu

- **Scripts automatiques** : `../scripts/seed-firebase.js`
- **Données JSON** : Pour import manuel
- **Règles de sécurité** : Firestore et Storage

## 🚀 Option 1 : Script automatique (Recommandé)

### Installation
```bash
# Installer les dépendances Node.js pour Firebase
npm install firebase

# Exécuter le script de seeding
node scripts/seed-firebase.js
```

Le script va créer automatiquement :
- ✅ **8 signalements** de test (différents types et gravités)
- ✅ **5 utilisateurs** avec profils complets
- ✅ **10 votes** sur les signalements

## 📁 Option 2 : Import manuel JSON

### Étapes dans la console Firebase

1. **Aller dans Firestore Database**
2. **Créer les collections** :

#### Collection `reports`
- Importer le fichier `reports.json`
- Créer un nouveau document pour chaque objet
- ⚠️ **Important** : Convertir les champs `location` en GeoPoint :
  ```json
  "location": {
    "_latitude": 48.8566,
    "_longitude": 2.3522
  }
  ```

#### Collection `users`
- Importer le fichier `users.json`
- Chaque utilisateur représente un profil complet

#### Collection `reportVotes` 
- Importer le fichier `reportVotes.json`
- Représente les votes des utilisateurs sur les signalements

## 🔒 Configuration des règles de sécurité

### Firestore Rules
1. Aller dans **Firestore Database > Rules**
2. Copier le contenu de `../firebase-rules/firestore.rules`
3. **Publier** les règles

### Storage Rules
1. Aller dans **Storage > Rules**
2. Copier le contenu de `../firebase-rules/storage.rules`  
3. **Publier** les règles

## 📊 Données de test créées

### 🚨 Signalements (8 total)
- **2 Critiques** : Incendie + Urgence médicale
- **2 Élevés** : Accident + Crime
- **2 Moyens** : Infrastructure + Inondation
- **2 Faibles** : Gaz + Câbles électriques

### 👥 Utilisateurs (5 total)
- **1 Modérateur** : Pierre Durand
- **4 Utilisateurs** : Jean, Marie, Sophie, Thomas
- Réputation et historique variables

### 🗳️ Votes (10 total)
- Répartis sur plusieurs signalements
- Types : upvote, downvote, confirm

## 🌍 Localisation

Tous les signalements sont situés à **Paris** avec des coordonnées réelles :
- Tour Eiffel, Louvre, Arc de Triomphe
- Notre-Dame, Montmartre, Île Saint-Louis
- Quartier Latin

## ⚙️ Configuration requise

### Dans Firebase Console :

1. **Authentication**
   - Activer **Phone** authentication
   - Configurer les numéros de test si besoin

2. **Firestore Database**
   - Créer en mode **test** puis appliquer les règles
   - Créer les index automatiquement

3. **Storage**
   - Activer Firebase Storage
   - Appliquer les règles de sécurité

4. **App Check** (Optionnel)
   - Activer pour la sécurité renforcée

## 🧪 Test de l'application

Une fois les données importées :

1. **Démarrer l'app** : `npm run dev`
2. **Aller sur** : http://localhost:3000/dashboard
3. **Voir les signalements** dans la liste
4. **Tester la création** d'un nouveau signalement

## 🔧 Personnalisation

### Modifier les données
- Éditer les fichiers JSON
- Relancer l'import ou le script

### Ajouter des types de danger
- Modifier `dangerType` dans les données
- Mettre à jour les types dans le code TypeScript

### Changer les localisations  
- Modifier les coordonnées GPS
- Adapter aux villes de votre choix

## 🛡️ Sécurité

Les règles implémentent :
- ✅ **Lecture publique** des signalements
- ✅ **Écriture authentifiée** uniquement
- ✅ **Validation** des données stricte
- ✅ **Rôles** (user, moderator, admin)
- ✅ **Protection** contre les modifications malveillantes

## 📞 Support

En cas de problème :
1. Vérifier les règles Firebase
2. Contrôler les permissions
3. Regarder la console Firebase pour les erreurs
4. Tester avec un utilisateur de test

---

**Happy coding! 🚀** 