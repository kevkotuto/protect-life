# 🧪 Mode Test - Tester sans Firebase

Ce guide vous explique comment tester l'application **Protect Life** sans configurer Firebase.

## ⚡ Activation du mode test

### 1. **Créer le fichier `.env.local`**

Créez un fichier `.env.local` à la racine du projet :

```bash
# Mode de test - bypasser l'authentification Firebase
NEXT_PUBLIC_BYPASS_AUTH=true

# Les autres variables ne sont pas nécessaires en mode test
NEXT_PUBLIC_FIREBASE_API_KEY=test
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=test
NEXT_PUBLIC_FIREBASE_APP_ID=test
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=test
```

### 2. **Redémarrer l'application**

```bash
npm run dev
```

## 🎯 Que fait le mode test ?

### ✅ **Authentification simulée**
- ✅ Utilisateur fictif automatiquement connecté
- ✅ Pas besoin de SMS ou Firebase Auth
- ✅ Accès direct au dashboard

### ✅ **Données fictives**
- ✅ 3 signalements d'exemple prêts à l'emploi
- ✅ Utilisateur de test avec profil complet
- ✅ Toutes les fonctionnalités testables

### ✅ **Fonctionnalités disponibles**
- ✅ **Navigation** - Toutes les pages accessibles
- ✅ **Dashboard** - Voir les signalements fictifs
- ✅ **Création** - Ajouter de nouveaux signalements
- ✅ **Votes** - Tester les interactions
- ✅ **Interface** - Tester l'UI complète

## 🔍 Comment tester

### 1. **Accéder au dashboard**
- Aller sur : `http://localhost:3000/dashboard`
- ✅ Accès direct sans connexion

### 2. **Tester la création de signalement**
- Cliquer sur **"Signaler un danger"**
- Remplir le formulaire
- ✅ Pas besoin de géolocalisation réelle

### 3. **Voir les signalements fictifs**
- 🚗 Accident sur autoroute (gravité élevée)
- 🔥 Incendie dans immeuble (critique)
- 🏗️ Nid de poule (moyen)

### 4. **Tester les votes**
- Cliquer sur les boutons de vote
- ✅ Simule les interactions sans base de données

## 📝 Console de débogage

En mode test, vous verrez dans la console :

```
🧪 MODE TEST ACTIVÉ - Utilisateur fictif connecté
🧪 Mock: Récupération signalements
🧪 Mock: Création signalement
```

## 🔄 Revenir au mode normal

### Pour utiliser Firebase en production :

1. **Modifier `.env.local`** :
```bash
NEXT_PUBLIC_BYPASS_AUTH=false
# Ajouter vos vraies clés Firebase
```

2. **Redémarrer** :
```bash
npm run dev
```

## 📋 Exemple complet `.env.local`

```bash
# =============================
# MODE TEST (sans Firebase)
# =============================
NEXT_PUBLIC_BYPASS_AUTH=true

# =============================
# MODE PRODUCTION (avec Firebase)
# =============================
# NEXT_PUBLIC_BYPASS_AUTH=false
# NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC6HvlXQHI8giacf350k5h3ZHgENQuySuM
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=protect-life-4279a.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=protect-life-4279a
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=protect-life-4279a.firebasestorage.app
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=79724457523
# NEXT_PUBLIC_FIREBASE_APP_ID=1:79724457523:web:5ac8b5d3d751ca6eb2fd46
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YFMQ8Z1247

# Configuration Mapbox (optionnel)
# NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

## ⚠️ Important

- ✅ **Mode test** : Parfait pour développer l'UI
- ✅ **Données temporaires** : Les signalements créés ne sont pas sauvegardés
- ✅ **Pas de SMS** : L'authentification est simulée
- ✅ **Rapide** : Pas besoin de configurer Firebase pour commencer

Le mode test vous permet de **développer et tester rapidement** toute l'interface sans configuration complexe !

---

**Happy testing! 🚀** 