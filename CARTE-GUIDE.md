# 🗺️ Guide de la Carte Interactive - Protect Life

La carte interactive de **Protect Life** utilise **OpenStreetMap** pour afficher tous les signalements de dangers en temps réel.

## 🎯 Accès à la carte

### **Dashboard** - Vue intégrée
- Aller sur `/dashboard`
- Cliquer sur l'onglet **"Carte"**
- Carte affichée dans le dashboard (600px de haut)

### **Page dédiée** - Vue plein écran
- Aller sur `/map` ou cliquer **"Carte plein écran"** dans le dashboard
- Carte en plein écran avec filtres avancés
- Hauteur adaptable à l'écran

## 🔍 Fonctionnalités de la carte

### **Marqueurs personnalisés**
- 🟢 **Vert** = Gravité faible
- 🟡 **Jaune** = Gravité moyenne  
- 🟠 **Orange** = Gravité élevée
- 🔴 **Rouge** = Gravité critique

### **Icônes par type de danger**
- 🚗 Accidents de circulation
- 🔥 Incendies
- 🚑 Urgences médicales
- 🚨 Crimes/Vols
- 🌪️ Catastrophes naturelles
- 🏗️ Problèmes d'infrastructure
- ☣️ Dangers environnementaux
- ⚠️ Autres dangers

## 📍 Interaction avec les marqueurs

### **Clic sur un marqueur**
- Ouverture automatique d'un **popup détaillé**
- Informations complètes du signalement
- Actions de vote disponibles

### **Contenu du popup**
- ✅ **Titre** et **statut** du signalement
- ✅ **Type** et **niveau de gravité**
- ✅ **Description** complète
- ✅ **Adresse** (si disponible)
- ✅ **Heure** relative (il y a X minutes/heures)
- ✅ **Boutons de vote** : 👍 👎 ✅ Confirmer

### **Actions disponibles**
- **👍 Upvote** - Soutenir le signalement
- **👎 Downvote** - Contester le signalement  
- **✅ Confirmer** - Valider si vous êtes témoin

## 🔧 Filtres avancés (page `/map`)

### **Filtrer par type**
- Tous les types
- Types spécifiques (accidents, incendies, etc.)

### **Filtrer par gravité**
- Toutes les gravités
- Niveaux spécifiques (faible à critique)

### **Interface de filtrage**
- Bouton **"Filtres"** dans le header
- Sélecteurs déroulants intuitifs
- Mise à jour en temps réel

## 🗂️ Légende

Une **légende flottante** est affichée en bas à gauche :

```
🟢 Faible    - Danger mineur
🟡 Moyen     - Attention recommandée  
🟠 Élevé     - Éviter la zone
🔴 Critique  - Danger immédiat
```

## 📊 Données affichées (Mode Test)

Actuellement **5 signalements mockés** à Paris :

1. **🚗 Accident A6** (Élevé) - Collision, circulation ralentie
2. **🔥 Incendie immeuble** (Critique) - Évitez le secteur  
3. **🏗️ Nid de poule** (Moyen) - Attention véhicules
4. **🚨 Agression** (Élevé) - Restez vigilants
5. **🚑 Urgence cardiaque** (Critique) - Secours en route

## 🚀 Navigation

### **Dans le dashboard**
- Onglets **"Liste"** ↔ **"Carte"**
- Bouton **"Carte plein écran"**

### **Page carte dédiée**
- Bouton **"Retour"** vers le dashboard
- Compteur de signalements affichés
- Filtres complets

## 💡 Conseils d'utilisation

### **Performance**
- ✅ Chargement optimisé avec placeholder
- ✅ Zoom et pan fluides
- ✅ Marqueurs responsifs au hover

### **Interaction**
- **Cliquer** sur un marqueur pour voir les détails
- **Zoomer/dézoomer** avec la molette ou les boutons
- **Se déplacer** en glissant la carte
- **Voter** directement depuis les popups

### **Mobile**
- ✅ Interface responsive
- ✅ Popups adaptés aux petits écrans
- ✅ Boutons de taille appropriée

## 🔄 Mode Test vs Production

### **Mode Test** (NEXT_PUBLIC_BYPASS_AUTH=true)
- ✅ 5 signalements mockés prêts à l'emploi
- ✅ Votes simulés dans la console
- ✅ Aucune configuration Firebase requise

### **Mode Production** (avec Firebase)
- 🔄 Signalements réels depuis Firestore
- 🔄 Votes sauvegardés en base
- 🔄 Synchronisation temps réel

## 🛠️ Technologies utilisées

- **🗺️ Leaflet** - Moteur de carte open source
- **🌍 OpenStreetMap** - Données cartographiques gratuites
- **⚛️ React-Leaflet** - Intégration React
- **🎨 CSS personnalisé** - Marqueurs et popups stylisés

## 🔮 Fonctionnalités futures

- 🔄 **Géolocalisation** automatique de l'utilisateur
- 🔄 **Clustering** pour les zones denses
- 🔄 **Recherche d'adresse** sur la carte
- 🔄 **Historique** des signalements résolus
- 🔄 **Notifications** géographiques
- 🔄 **Heatmap** des zones à risque

---

**La carte interactive rend Protect Life encore plus puissant pour visualiser et comprendre les dangers de votre communauté ! 🛡️** 