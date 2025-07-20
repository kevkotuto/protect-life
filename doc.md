# Guide Complet : Application Protect Life avec Next.js et Firebase

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Prérequis](#prérequis)
4. [Configuration Firebase](#configuration-firebase)
5. [Installation et Configuration](#installation-et-configuration)
6. [Structure du Projet](#structure-du-projet)
7. [Configuration Next.js](#configuration-nextjs)
8. [Authentification](#authentification)
9. [Base de Données Firestore](#base-de-données-firestore)
10. [Composants UI](#composants-ui)
11. [Pages et Routes](#pages-et-routes)
12. [Services et API](#services-et-api)
13. [Géolocalisation](#géolocalisation)
14. [Upload d'Images](#upload-dimages)
15. [Transcription Vocale](#transcription-vocale)
16. [Intelligence Artificielle](#intelligence-artificielle)
17. [Notifications](#notifications)
18. [Déploiement](#déploiement)
19. [Tests](#tests)
20. [Sécurité](#sécurité)

## 🎯 Vue d'ensemble

**Protect Life** est une application web de signalement de dangers et situations d'urgence. Cette version utilise :

- **Frontend** : Next.js 14 avec App Router
- **Backend** : Firebase (Firestore, Auth, Storage, Functions)
- **UI** : Tailwind CSS + Radix UI
- **État** : React Query (TanStack Query)
- **Cartes** : Leaflet / Mapbox
- **Authentification** : SMS via Firebase Auth

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Next.js App   │◄───┤   Firebase      │◄───┤   External APIs │
│                 │    │   Services      │    │   (SMS, Maps)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       ├─ Firestore (Database)
         │                       ├─ Firebase Auth
         │                       ├─ Cloud Storage
         │                       ├─ Cloud Functions
         │                       └─ Firebase Analytics
         │
    ┌─────────┐
    │ Browser │
    │ Storage │
    └─────────┘
```

## 📋 Prérequis

- **Node.js** 18+
- **npm** ou **yarn**
- **Compte Firebase**
- **Compte Twilio** (pour SMS)
- **Compte Mapbox** (pour les cartes)

## 🔥 Configuration Firebase

### 1. Créer un Projet Firebase

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Créer un nouveau projet
firebase init
```

### 2. Configuration du Projet

```javascript
// firebase.config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
```

### 3. Variables d'Environnement

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Configuration Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Configuration Twilio (pour Cloud Functions)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## 🚀 Installation et Configuration

### 1. Créer le Projet Next.js

```bash
npx create-next-app@latest protect-life-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd protect-life-web
```

### 2. Installer les Dépendances

```bash
# Firebase
npm install firebase

# UI et Styling
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast @radix-ui/react-tabs @radix-ui/react-switch @radix-ui/react-avatar @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-tooltip

# State Management et Data Fetching
npm install @tanstack/react-query

# Forms et Validation
npm install react-hook-form @hookform/resolvers zod

# Cartes et Géolocalisation
npm install leaflet react-leaflet

# Utilitaires
npm install class-variance-authority clsx tailwind-merge lucide-react date-fns

# Types
npm install -D @types/leaflet
```

### 3. Configuration TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📁 Structure du Projet

```
src/
├── app/                          # App Router (Next.js 13+)
│   ├── (auth)/                   # Groupe de routes auth
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── map/
│   │   └── page.tsx
│   ├── reports/
│   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/                   # Composants réutilisables
│   ├── ui/                      # Composants UI de base
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── auth/                    # Composants d'authentification
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   ├── reports/                 # Composants de signalements
│   │   ├── ReportCard.tsx
│   │   ├── ReportForm.tsx
│   │   ├── ReportList.tsx
│   │   └── ReportMap.tsx
│   ├── map/                     # Composants de carte
│   │   ├── Map.tsx
│   │   ├── MapMarker.tsx
│   │   └── MapFilters.tsx
│   └── layout/                  # Composants de layout
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/                         # Utilitaires et configurations
│   ├── firebase/               # Configuration Firebase
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   ├── storage.ts
│   │   └── functions.ts
│   ├── utils.ts                # Utilitaires généraux
│   ├── validations.ts          # Schémas de validation Zod
│   └── constants.ts            # Constantes de l'application
├── hooks/                      # Hooks personnalisés
│   ├── useAuth.ts
│   ├── useReports.ts
│   ├── useGeolocation.ts
│   └── useNotifications.ts
├── types/                      # Types TypeScript
│   ├── auth.ts
│   ├── reports.ts
│   ├── user.ts
│   └── global.ts
└── styles/                     # Styles globaux
    └── globals.css
```

## ⚙️ Configuration Next.js

### 1. Configuration de Base

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### 2. Middleware pour l'Authentification

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
 
  // Routes protégées
  const protectedRoutes = ['/dashboard', '/profile', '/reports/create'];
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Rediriger les utilisateurs connectés loin des pages d'auth
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## 🔐 Authentification

### 1. Service d'Authentification

```typescript
// lib/firebase/auth.ts
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';

export class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;

  // Initialiser reCAPTCHA
  initRecaptcha(containerId: string) {
    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
    });
  }

  // Envoyer un code SMS
  async sendVerificationCode(phoneNumber: string): Promise<void> {
    if (!this.recaptchaVerifier) {
      throw new Error('reCAPTCHA not initialized');
    }

    try {
      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier
      );
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  // Vérifier le code SMS
  async verifyCode(code: string): Promise<User> {
    if (!this.confirmationResult) {
      throw new Error('No confirmation result available');
    }

    try {
      const result = await this.confirmationResult.confirm(code);
      return result.user;
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  }

  // Déconnexion
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  // Observer les changements d'état d'authentification
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

export const authService = new AuthService();
```

### 2. Hook d'Authentification

```typescript
// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/lib/firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithPhone = async (phoneNumber: string) => {
    await authService.sendVerificationCode(phoneNumber);
  };

  const verifyCode = async (code: string) => {
    const user = await authService.verifyCode(code);
    setUser(user);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signInWithPhone,
    verifyCode,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3. Composant de Connexion

```typescript
// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
 
  const { signInWithPhone, verifyCode } = useAuth();
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      await signInWithPhone(phoneNumber);
      setStep('code');
    } catch (error) {
      console.error('Error sending code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      await verifyCode(verificationCode);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error verifying code:', error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <form onSubmit={handleSendCode} className="space-y-4">
        <div>
          <label htmlFor="phone">Numéro de téléphone</label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+225 07 12 34 56 78"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer le code'}
        </Button>
        <div id="recaptcha-container"></div>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      <div>
        <label htmlFor="code">Code de vérification</label>
        <Input
          id="code"
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="123456"
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Vérification...' : 'Se connecter'}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => setStep('phone')}
      >
        Retour
      </Button>
    </form>
  );
}
```

## 🗄️ Base de Données Firestore

### 1. Structure des Collections

```typescript
// types/firestore.ts
export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  reputation: number;
  reportsCount: number;
  confirmedReportsCount: number;
  isActive: boolean;
  preferences: {
    notifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  dangerType: 'traffic_accident' | 'fire' | 'medical_emergency' | 'crime' | 'natural_disaster' | 'infrastructure_issue' | 'environmental_hazard' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'confirmed' | 'resolved' | 'false_alarm' | 'expired';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images: string[];
  upvotes: number;
  downvotes: number;
  confirmations: number;
  metadata?: {
    weather?: string;
    timeOfDay?: string;
    trafficConditions?: string;
  };
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportVote {
  id: string;
  userId: string;
  reportId: string;
  voteType: 'upvote' | 'downvote' | 'confirm';
  createdAt: Date;
}
```

### 2. Service Firestore

```typescript
// lib/firebase/firestore.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  serverTimestamp,
  GeoPoint
} from 'firebase/firestore';
import { db } from './config';
import { User, Report, ReportVote } from '@/types/firestore';

export class FirestoreService {
  // Users
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async getUserById(userId: string): Promise<User | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
   
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Reports
  async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'reports'), {
      ...reportData,
      location: new GeoPoint(reportData.location.latitude, reportData.location.longitude),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async getReports(filters?: {
    dangerType?: string;
    severity?: string;
    status?: string;
    limit?: number;
    startAfter?: QueryDocumentSnapshot;
  }): Promise<{ reports: Report[]; lastDoc?: QueryDocumentSnapshot }> {
    let q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    );

    if (filters?.dangerType) {
      q = query(q, where('dangerType', '==', filters.dangerType));
    }

    if (filters?.severity) {
      q = query(q, where('severity', '==', filters.severity));
    }

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    if (filters?.startAfter) {
      q = query(q, startAfter(filters.startAfter));
    }

    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Report[];

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { reports, lastDoc };
  }

  async getReportById(reportId: string): Promise<Report | null> {
    const docRef = doc(db, 'reports', reportId);
    const docSnap = await getDoc(docRef);
   
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Report;
    }
    return null;
  }

  async updateReport(reportId: string, data: Partial<Report>): Promise<void> {
    const docRef = doc(db, 'reports', reportId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteReport(reportId: string): Promise<void> {
    const docRef = doc(db, 'reports', reportId);
    await deleteDoc(docRef);
  }

  // Votes
  async createVote(voteData: Omit<ReportVote, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'reportVotes'), {
      ...voteData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async getUserVote(userId: string, reportId: string): Promise<ReportVote | null> {
    const q = query(
      collection(db, 'reportVotes'),
      where('userId', '==', userId),
      where('reportId', '==', reportId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as ReportVote;
    }
    return null;
  }

  async deleteVote(voteId: string): Promise<void> {
    const docRef = doc(db, 'reportVotes', voteId);
    await deleteDoc(docRef);
  }
}

export const firestoreService = new FirestoreService();
```

### 3. Hook pour les Signalements

```typescript
// hooks/useReports.ts
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { firestoreService } from '@/lib/firebase/firestore';
import { Report } from '@/types/firestore';

export function useReports(filters?: any) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => firestoreService.getReports(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useReport(reportId: string) {
  return useQuery({
    queryKey: ['report', reportId],
    queryFn: () => firestoreService.getReportById(reportId),
    enabled: !!reportId,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: firestoreService.createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, data }: { reportId: string; data: Partial<Report> }) =>
      firestoreService.updateReport(reportId, data),
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
    },
  });
}

export function useVoteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reportId,
      userId,
      voteType
    }: {
      reportId: string;
      userId: string;
      voteType: 'upvote' | 'downvote' | 'confirm';
    }) => {
      // Vérifier si l'utilisateur a déjà voté
      const existingVote = await firestoreService.getUserVote(userId, reportId);
     
      if (existingVote) {
        await firestoreService.deleteVote(existingVote.id);
      }

      // Créer le nouveau vote
      await firestoreService.createVote({
        userId,
        reportId,
        voteType,
      });

      // Mettre à jour les compteurs du signalement
      const report = await firestoreService.getReportById(reportId);
      if (report) {
        const updates: Partial<Report> = {};
       
        if (existingVote) {
          // Décrémenter l'ancien vote
          if (existingVote.voteType === 'upvote') {
            updates.upvotes = Math.max(0, report.upvotes - 1);
          } else if (existingVote.voteType === 'downvote') {
            updates.downvotes = Math.max(0, report.downvotes - 1);
          } else if (existingVote.voteType === 'confirm') {
            updates.confirmations = Math.max(0, report.confirmations - 1);
          }
        }

        // Incrémenter le nouveau vote
        if (voteType === 'upvote') {
          updates.upvotes = (updates.upvotes ?? report.upvotes) + 1;
        } else if (voteType === 'downvote') {
          updates.downvotes = (updates.downvotes ?? report.downvotes) + 1;
        } else if (voteType === 'confirm') {
          updates.confirmations = (updates.confirmations ?? report.confirmations) + 1;
         
          // Auto-confirmation si 3+ confirmations
          if (updates.confirmations >= 3) {
            updates.status = 'confirmed';
          }
        }

        await firestoreService.updateReport(reportId, updates);
      }
    },
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
    },
  });
}
```

## 🗺️ Géolocalisation

### 1. Hook de Géolocalisation

```typescript
// hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

interface GeolocationState {
  location: { latitude: number; longitude: number } | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: 'Géolocalisation non supportée',
        loading: false,
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        location: null,
        error: error.message,
        loading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 600000, // 10 minutes
    });
  }, []);

  const refetch = () => {
    setState(prev => ({ ...prev, loading: true }));
   
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          location: null,
          error: error.message,
          loading: false,
        });
      }
    );
  };

  return { ...state, refetch };
}
```

### 2. Composant de Carte

```typescript
// components/map/Map.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report } from '@/types/firestore';

interface MapProps {
  reports: Report[];
  center: [number, number];
  zoom?: number;
  onReportClick?: (report: Report) => void;
}

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

export function Map({ reports, center, zoom = 13, onReportClick }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Créer la carte
    mapRef.current = L.map(containerRef.current).setView(center, zoom);

    // Ajouter les tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Nettoyer les marqueurs existants
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current!.removeLayer(layer);
      }
    });

    // Ajouter les nouveaux marqueurs
    reports.forEach((report) => {
      if (!report.location) return;

      const icon = L.divIcon({
        className: `marker-${report.severity}`,
        html: getDangerIcon(report.dangerType),
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker(
        [report.location.latitude, report.location.longitude],
        { icon }
      ).addTo(mapRef.current!);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${report.title}</h3>
          <p class="text-sm text-gray-600">${report.description}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs bg-${getSeverityColor(report.severity)}-100 text-${getSeverityColor(report.severity)}-800 px-2 py-1 rounded">
              ${report.severity}
            </span>
            <span class="text-xs text-gray-500">
              ${new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      `);

      if (onReportClick) {
        marker.on('click', () => onReportClick(report));
      }
    });
  }, [reports, onReportClick]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return <div ref={containerRef} className="w-full h-full" />;
}

function getDangerIcon(dangerType: string): string {
  const icons: Record<string, string> = {
    traffic_accident: '🚗',
    fire: '🔥',
    medical_emergency: '🚑',
    crime: '🚨',
    natural_disaster: '🌪️',
    infrastructure_issue: '🏗️',
    environmental_hazard: '☣️',
    other: '⚠️',
  };
  return icons[dangerType] || '⚠️';
}

function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    critical: 'red',
  };
  return colors[severity] || 'gray';
}
```

## 📸 Upload d'Images

### 1. Service de Stockage

```typescript
// lib/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export class StorageService {
  async uploadReportImage(
    file: File,
    reportId: string,
    userId: string
  ): Promise<string> {
    const filename = `reports/${reportId}/${userId}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);
   
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
   
    return downloadURL;
  }

  async uploadUserAvatar(file: File, userId: string): Promise<string> {
    const filename = `avatars/${userId}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);
   
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
   
    return downloadURL;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  }
}

export const storageService = new StorageService();
```

### 2. Composant d'Upload d'Images

```typescript
// components/ui/ImageUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload } from 'lucide-react';
import { Button } from './button';

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp']
  },
  disabled = false
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...value, ...acceptedFiles].slice(0, maxFiles);
    onChange(newFiles);

    // Créer les previews
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles));
  }, [value, onChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - value.length,
    disabled: disabled || value.length >= maxFiles,
  });

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);

    // Révoquer l'URL de prévisualisation
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Déposez les images ici...'
              : 'Cliquez ou déposez des images ici'
            }
          </p>
          <p className="text-xs text-gray-500">
            Maximum {maxFiles} images, {maxSize / 1024 / 1024}MB par image
          </p>
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={previews[index] || URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🔔 Notifications

### 1. Hook de Notifications

```typescript
// hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from '@/lib/firebase/config';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier la permission actuelle
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);

    if (permission === 'granted') {
      try {
        const messaging = getMessaging(app);
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        });

        if (currentToken) {
          setToken(currentToken);
          console.log('FCM Token:', currentToken);
          return currentToken;
        } else {
          console.log('No registration token available.');
        }
      } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
      }
    }

    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, options);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(app);
     
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
       
        showNotification(
          payload.notification?.title || 'Nouvelle notification',
          {
            body: payload.notification?.body,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
          }
        );
      });

      return unsubscribe;
    }
  }, [permission]);

  return {
    permission,
    token,
    requestPermission,
    showNotification,
  };
}
```

### 2. Service Worker

```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  // Votre configuration Firebase
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
 
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## 🚀 Déploiement

### 1. Configuration Vercel

```json
// vercel.json
{
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase_api_key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase_auth_domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase_project_id"
  }
}
```

### 2. Configuration Firebase Hosting

```json
// firebase.json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 3. Règles de Sécurité Firestore

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }

    // Reports
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        hasRole('admin') ||
        hasRole('moderator')
      );
      allow delete: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        hasRole('admin')
      );
    }

    // Report Votes
    match /reportVotes/{voteId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
  }
}
```

### 4. Scripts de Build

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next build && next export",
    "deploy:vercel": "vercel --prod",
    "deploy:firebase": "npm run build && firebase deploy"
  }
}
```

## 🧪 Tests

### 1. Configuration Jest

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### 2. Tests de Composants

```typescript
// __tests__/components/ReportCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ReportCard } from '@/components/reports/ReportCard';
import { Report } from '@/types/firestore';

const mockReport: Report = {
  id: '1',
  userId: 'user1',
  dangerType: 'traffic_accident',
  severity: 'high',
  status: 'pending',
  title: 'Test Report',
  description: 'Test description',
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    address: 'Paris, France'
  },
  images: [],
  upvotes: 5,
  downvotes: 1,
  confirmations: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ReportCard', () => {
  it('renders report information correctly', () => {
    render(<ReportCard report={mockReport} />);
   
    expect(screen.getByText('Test Report')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Paris, France')).toBeInTheDocument();
  });

  it('displays correct severity styling', () => {
    render(<ReportCard report={mockReport} />);
   
    const severityElement = screen.getByText('high');
    expect(severityElement).toHaveClass('bg-orange-500');
  });
});
```

## 🔒 Sécurité

### 1. Validation des Données

```typescript
// lib/validations.ts
import { z } from 'zod';

export const reportSchema = z.object({
  dangerType: z.enum([
    'traffic_accident',
    'fire',
    'medical_emergency',
    'crime',
    'natural_disaster',
    'infrastructure_issue',
    'environmental_hazard',
    'other'
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
  }),
  images: z.array(z.string()).max(5),
});

export const userSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/),
});
```

### 2. Middleware de Sécurité

```typescript
// middleware/security.ts
import { NextRequest, NextResponse } from 'next/server';

export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;"
  );

  // Other security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
}
```

## 🎤 Transcription Vocale

### 1. Vue d'ensemble

La transcription vocale permet aux utilisateurs de créer des signalements en enregistrant un message vocal qui sera automatiquement transcrit et formaté.

**Pipeline de traitement :**
1. **Enregistrement** → Interface intuitive avec MediaRecorder API
2. **Whisper** → Transcription audio haute précision (OpenAI)
3. **GPT-4o-mini** → Amélioration et structuration du texte
4. **Auto-remplissage** → Titre et description générés automatiquement

### 2. Service de Transcription

```typescript
// lib/ai/speechTranscription.ts
import OpenAI from 'openai';
import { chatModel } from './config';

export class SpeechTranscriptionService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult | null> {
    try {
      // Créer un File à partir du Blob
      const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

      // Transcrire avec Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'fr',
        prompt: 'Signalement d\'urgence à Abidjan, Côte d\'Ivoire. Quartiers: Cocody, Plateau, Adjamé, Marcory, Koumassi, Treichville.',
      });

      // Améliorer la transcription avec GPT-4o-mini
      const improvedText = await this.improvementChain.invoke({
        originalText: transcription.text
      });

      return {
        originalText: transcription.text,
        improvedText: improvedText.trim(),
        confidence: 90,
        language: 'fr'
      };
    } catch (error) {
      console.error('Erreur lors de la transcription:', error);
      return null;
    }
  }

  formatForReport(transcription: TranscriptionResult): { title: string; description: string } {
    const text = transcription.improvedText;
    
    // Extraire un titre (première phrase)
    const sentences = text.split(/[.!?]+/);
    let title = sentences[0]?.trim() || 'Signalement vocal';
    
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    return {
      title: title || 'Signalement vocal',
      description: text
    };
  }
}

export const speechTranscription = new SpeechTranscriptionService();
```

### 3. Composant d'Enregistrement Vocal

```typescript
// components/audio/VoiceRecorder.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Upload } from 'lucide-react';

export function VoiceRecorder({ onTranscriptionComplete, onError }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      onError?.('Impossible d\'accéder au microphone');
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      onTranscriptionComplete?.(result);
    } catch (error) {
      onError?.('Erreur lors de la transcription');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!audioBlob ? (
        <Button 
          onClick={isRecording ? stopRecording : startRecording}
          className="flex items-center gap-2"
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isRecording ? 'Arrêter' : 'Enregistrer'}
        </Button>
      ) : (
        <Button 
          onClick={transcribeAudio}
          disabled={isTranscribing}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isTranscribing ? 'Transcription...' : 'Transcrire'}
        </Button>
      )}
    </div>
  );
}
```

### 4. API Route de Transcription

```typescript
// app/api/ai/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { speechTranscription } from '@/lib/ai/speechTranscription';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Fichier audio requis' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 25MB pour Whisper)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fichier audio trop volumineux (max 25MB)' },
        { status: 400 }
      );
    }

    // Transcrire avec Whisper + GPT-4o-mini
    const blob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
    const transcriptionResult = await speechTranscription.transcribeAudio(blob);

    if (!transcriptionResult) {
      return NextResponse.json(
        { error: 'Transcription échouée' },
        { status: 500 }
      );
    }

    // Formatter pour un signalement
    const formatted = speechTranscription.formatForReport(transcriptionResult);

    return NextResponse.json({
      ...transcriptionResult,
      formatted
    });

  } catch (error) {
    console.error('Erreur transcription:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
```

### 5. Intégration dans le Formulaire

```typescript
// components/reports/ReportForm.tsx (modification)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceRecorder } from '@/components/audio/VoiceRecorder';

export function ReportForm() {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');

  const handleTranscriptionComplete = (transcription: any) => {
    const { formatted } = transcription;
    
    // Remplir automatiquement le formulaire
    form.setValue('title', formatted.title);
    form.setValue('description', formatted.description);
    
    // Basculer vers le mode texte
    setInputMode('text');
    
    toast.success('Transcription terminée !');
  };

  return (
    <form>
      {/* Mode de saisie */}
      <Tabs value={inputMode} onValueChange={setInputMode}>
        <TabsList>
          <TabsTrigger value="text">
            <Keyboard className="h-4 w-4 mr-2" />
            Clavier
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Mic className="h-4 w-4 mr-2" />
            Vocal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          {/* Champs de saisie classiques */}
          <Input placeholder="Titre..." {...titleField} />
          <Textarea placeholder="Description..." {...descField} />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceRecorder
            onTranscriptionComplete={handleTranscriptionComplete}
            onError={(error) => toast.error(error)}
          />
        </TabsContent>
      </Tabs>
    </form>
  );
}
```

## 🤖 Intelligence Artificielle

### 1. Configuration OpenAI

```typescript
// lib/ai/config.ts
import { ChatOpenAI } from '@langchain/openai';

export const chatModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.3,
});

export const isAIEnabled = () => {
  return !!process.env.OPENAI_API_KEY;
};
```

### 2. Analyse Intelligente des Signalements

```typescript
// lib/ai/reportAnalyzer.ts
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { chatModel } from './config';

const reportAnalysisPrompt = PromptTemplate.fromTemplate(`
Tu es un expert en analyse de signalements d'urgence pour la ville d'Abidjan.

SIGNALEMENT:
Titre: {title}
Description: {description}
Lieu: {location}

Analyse ce signalement et détermine:
1. Type de danger (traffic_accident, fire, medical_emergency, crime, natural_disaster, infrastructure_issue, environmental_hazard, other)
2. Niveau de gravité (low, medium, high, critical)
3. Confiance dans l'analyse (0-100%)
4. Justification de l'analyse
5. Actions recommandées

Réponds en JSON valide uniquement.
`);

export class ReportAnalyzer {
  private analysisChain;

  constructor() {
    const outputParser = new StringOutputParser();
    this.analysisChain = reportAnalysisPrompt.pipe(chatModel).pipe(outputParser);
  }

  async analyzeReport(title: string, description: string, location?: any) {
    try {
      const result = await this.analysisChain.invoke({
        title,
        description,
        location: location ? `${location.latitude}, ${location.longitude}` : 'Non spécifié'
      });

      return JSON.parse(result);
    } catch (error) {
      console.error('Erreur analyse IA:', error);
      return null;
    }
  }
}

export const reportAnalyzer = new ReportAnalyzer();
```

### 3. Assistant Sécurité IA

```typescript
// lib/ai/safetyAssistant.ts
export class SafetyAssistant {
  async getSecurityAdvice(question: string, location?: any) {
    const prompt = `
Tu es un expert en sécurité pour Abidjan, Côte d'Ivoire.

Question: ${question}
Lieu: ${location || 'Abidjan'}

Fournis des conseils de sécurité spécifiques, pratiques et adaptés au contexte local d'Abidjan.
Inclus les numéros d'urgence ivoiriens:
- Police: 110 ou 111
- Pompiers: 180
- SAMU: 185

Réponds en français de manière claire et actionnable.
`;

    try {
      const response = await chatModel.invoke(prompt);
      return response.content;
    } catch (error) {
      console.error('Erreur conseils sécurité:', error);
      return null;
    }
  }
}

export const safetyAssistant = new SafetyAssistant();
```

### 4. Système de Fallback Intelligent

Pour garantir la continuité de service, un système de fallback basé sur des règles est implémenté :

```typescript
// lib/ai/fallback.ts
export class AIFallbackService {
  analyzeReportFallback(title: string, description: string) {
    // Détection par mots-clés
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    
    let dangerType = 'other';
    if (titleLower.includes('accident') || descLower.includes('voiture')) {
      dangerType = 'traffic_accident';
    } else if (titleLower.includes('feu') || descLower.includes('incendie')) {
      dangerType = 'fire';
    }
    // ... autres détections

    let severity = 'medium';
    if (descLower.includes('urgent') || descLower.includes('grave')) {
      severity = 'critical';
    }

    return {
      dangerType,
      severity,
      confidence: 75,
      reasoning: `Analyse basée sur les mots-clés détectés`,
      suggestedActions: this.getActionsByType(dangerType)
    };
  }
}
```

## 📝 Conclusion

Cette documentation couvre tous les aspects essentiels pour développer l'application Protect Life avec Next.js et Firebase. Les points clés incluent :

1. **Architecture moderne** avec Next.js 14 et App Router
2. **Backend Firebase** complet (Auth, Firestore, Storage, Functions)
3. **Authentification SMS** sécurisée
4. **Interface utilisateur** moderne avec Tailwind CSS
5. **Géolocalisation** et cartes interactives
6. **Upload d'images** optimisé
7. **🎤 Transcription vocale** avec OpenAI Whisper + GPT-4o-mini
8. **🤖 Intelligence artificielle** pour analyse automatique des signalements
9. **🛡️ Système de fallback** intelligent pour garantir la continuité
10. **Notifications push** en temps réel
11. **Tests** automatisés
12. **Sécurité** renforcée
13. **Déploiement** optimisé

L'application résultante sera une PWA moderne, sécurisée et performante pour le signalement de dangers en temps réel.

---

**Prochaines étapes recommandées :**

1. Configurer Firebase et Next.js selon ce guide
2. Implémenter l'authentification SMS
3. Développer les composants de signalement
4. Intégrer les cartes et la géolocalisation
5. 🎤 **Configurer la transcription vocale** (Whisper + GPT-4o-mini)
6. 🤖 **Intégrer l'IA** pour l'analyse automatique des signalements
7. Ajouter les notifications push
8. Optimiser pour la production
9. Déployer et tester

Cette architecture garantit une application scalable, maintenable et sécurisée pour protéger votre communauté ! 🛡️

--
Shemaeya Maresha KLA
SNOLI Group CEO 
Tel : +225 07 89 308 214
WhatsApp: +225 07 12 34 56 78
ᐧ