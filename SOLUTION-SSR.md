# 🔧 Solution : Erreur SSR "window is not defined"

## ❌ **Problème rencontré**

```
Runtime Error
window is not defined
components/map/InteractiveMap.tsx (4:1)
```

Cette erreur se produit car **Leaflet** et **React-Leaflet** dépendent de l'objet `window` qui n'existe que côté client, mais Next.js essaie de rendre le composant côté serveur (SSR).

## ✅ **Solution implémentée**

### **1. Création d'un MapWrapper**

J'ai créé `components/map/MapWrapper.tsx` qui utilise :

- **`next/dynamic`** pour le chargement dynamique
- **`ssr: false`** pour désactiver le SSR
- **Composant de chargement** avec la bonne hauteur

```typescript
const DynamicInteractiveMap = dynamic(
  () => import('./InteractiveMap').then((mod) => ({ default: mod.InteractiveMap })),
  {
    ssr: false, // ⭐ Clé de la solution
    loading: () => null,
  }
);
```

### **2. Gestion côté client**

```typescript
export function MapWrapper(props: MapWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // ⭐ S'assurer qu'on est côté client
  }, []);

  if (!isClient) {
    return <LoadingMap height={props.height} />; // Placeholder
  }

  return <DynamicInteractiveMap {...props} />;
}
```

### **3. Double vérification dans InteractiveMap**

```typescript
useEffect(() => {
  // S'assurer que nous sommes côté client
  if (typeof window !== 'undefined') {
    setMapLoaded(true);
  }
}, []);
```

## 🔄 **Changements effectués**

### **Avant** (❌ Erreur SSR)
```typescript
// app/dashboard/page.tsx
import { InteractiveMap } from '@/components/map/InteractiveMap';

// Utilisation directe → Erreur SSR
<InteractiveMap reports={reports} />
```

### **Après** (✅ Fonctionnel)
```typescript
// app/dashboard/page.tsx  
import { MapWrapper } from '@/components/map/MapWrapper';

// Chargement dynamique → Pas d'erreur SSR
<MapWrapper reports={reports} />
```

## 🎯 **Pourquoi cette solution ?**

### **SSR (Server Side Rendering)**
- Next.js rend les composants côté serveur
- L'objet `window` n'existe pas côté serveur
- Leaflet a besoin de `window` pour fonctionner

### **Chargement dynamique**
- `next/dynamic` charge le composant uniquement côté client
- `ssr: false` évite le rendu côté serveur
- Le composant se charge après l'hydratation

### **Avantages**
- ✅ **Pas d'erreur SSR**
- ✅ **Meilleure performance** (chargement à la demande)
- ✅ **UX améliorée** (placeholder de chargement)
- ✅ **SEO préservé** (le reste de la page se rend normalement)

## 🚀 **Résultat**

- ✅ **Dashboard** (`/dashboard`) → Carte fonctionne dans l'onglet
- ✅ **Page carte** (`/map`) → Vue plein écran opérationnelle
- ✅ **Chargement fluide** avec placeholder
- ✅ **Pas d'erreur SSR** dans la console

## 💡 **Bonnes pratiques**

### **Pour d'autres composants similaires :**

1. **Identifier** les dépendances côté client (`window`, `document`, etc.)
2. **Wrapper** avec `next/dynamic` et `ssr: false`
3. **Placeholder** de chargement approprié
4. **Vérification** `typeof window !== 'undefined'`

### **Bibliothèques concernées :**
- 🗺️ **Leaflet** / React-Leaflet
- 📊 **Chart.js** / Recharts
- 🎨 **Canvas APIs**
- 📱 **Navigator APIs** (géolocalisation, etc.)

---

**La carte interactive fonctionne maintenant parfaitement sans erreur SSR ! 🎉** 