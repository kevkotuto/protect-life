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
import { User, Report, ReportVote } from '@/types';

// Mode de développement
const DEV_MODE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

// Données fictives pour les tests - Côte d'Ivoire (Abidjan)
const mockReports: Report[] = [
  {
    id: 'mock-1',
    userId: 'test-user-123',
    dangerType: 'traffic_accident',
    severity: 'high',
    status: 'pending',
    title: 'Accident sur l\'autoroute du Nord',
    description: 'Collision entre deux véhicules sur la voie vers l\'aéroport, circulation ralentie.',
    location: {
      latitude: 5.3491,
      longitude: -3.9624,
      address: 'Autoroute du Nord, vers Aéroport Félix Houphouët-Boigny, Abidjan'
    },
    images: [],
    upvotes: 15,
    downvotes: 2,
    confirmations: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-2',
    userId: 'test-user-123',
    dangerType: 'fire',
    severity: 'critical',
    status: 'confirmed',
    title: 'Incendie au marché de Cocody',
    description: 'Feu important dans une partie du marché. Évitez le secteur, pompiers sur place.',
    location: {
      latitude: 5.3464,
      longitude: -3.9854,
      address: 'Marché de Cocody, Abidjan'
    },
    images: [],
    upvotes: 32,
    downvotes: 0,
    confirmations: 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // Il y a 30 minutes
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'mock-3',
    userId: 'test-user-123',
    dangerType: 'infrastructure_issue',
    severity: 'medium',
    status: 'pending',
    title: 'Route dégradée à Marcory',
    description: 'Nids de poule importants sur la route principale, attention aux véhicules.',
    location: {
      latitude: 5.2847,
      longitude: -3.9883,
      address: 'Boulevard du Cameroun, Marcory, Abidjan'
    },
    images: [],
    upvotes: 8,
    downvotes: 1,
    confirmations: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2 heures
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'mock-4',
    userId: 'test-user-123',
    dangerType: 'crime',
    severity: 'high',
    status: 'pending',
    title: 'Vol à l\'arrachée signalé',
    description: 'Plusieurs vols à l\'arrachée signalés dans ce secteur. Restez vigilants.',
    location: {
      latitude: 5.3200,
      longitude: -4.0200,
      address: 'Quartier Adjamé, près du marché, Abidjan'
    },
    images: [],
    upvotes: 22,
    downvotes: 3,
    confirmations: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // Il y a 5 heures
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'mock-5',
    userId: 'test-user-123',
    dangerType: 'medical_emergency',
    severity: 'critical',
    status: 'confirmed',
    title: 'Urgence médicale au Plateau',
    description: 'Personne en détresse respiratoire - Secours SAMU en route.',
    location: {
      latitude: 5.3197,
      longitude: -4.0236,
      address: 'Place de la République, Plateau, Abidjan'
    },
    images: [],
    upvotes: 45,
    downvotes: 1,
    confirmations: 38,
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // Il y a 15 minutes
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'mock-6',
    userId: 'test-user-123',
    dangerType: 'natural_disaster',
    severity: 'high',
    status: 'confirmed',
    title: 'Inondations à Koumassi',
    description: 'Route inondée suite aux fortes pluies. Circulation impossible.',
    location: {
      latitude: 5.2889,
      longitude: -3.9464,
      address: 'Boulevard Giscard d\'Estaing, Koumassi, Abidjan'
    },
    images: [],
    upvotes: 28,
    downvotes: 2,
    confirmations: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // Il y a 45 minutes
    updatedAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 'mock-7',
    userId: 'test-user-123',
    dangerType: 'environmental_hazard',
    severity: 'medium',
    status: 'pending',
    title: 'Déversement suspect à Treichville',
    description: 'Liquide suspect déversé près de la lagune. Odeur forte signalée.',
    location: {
      latitude: 5.2936,
      longitude: -4.0028,
      address: 'Rue des Jardins, Treichville, Abidjan'
    },
    images: [],
    upvotes: 12,
    downvotes: 1,
    confirmations: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 90), // Il y a 1h30
    updatedAt: new Date(Date.now() - 1000 * 60 * 90),
  }
];

export class FirestoreService {
  // Users
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Création utilisateur', userData);
      return 'mock-user-id';
    }

    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async getUserById(userId: string): Promise<User | null> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Récupération utilisateur', userId);
      return {
        id: userId,
        phoneNumber: '+22507123456',
        firstName: 'Kouadio',
        lastName: 'Test',
        role: 'user',
        reputation: 100,
        reportsCount: 7,
        confirmedReportsCount: 5,
        isActive: true,
        preferences: {
          notifications: true,
          emailNotifications: false,
          pushNotifications: true,
          language: 'fr',
          theme: 'light'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
    }

    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Mise à jour utilisateur', userId, data);
      return;
    }

    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Reports
  async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Création signalement', reportData);
      const newId = 'mock-' + Date.now();
      mockReports.unshift({
        ...reportData,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return newId;
    }

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
    if (DEV_MODE) {
      console.log('🧪 Mock: Récupération signalements', filters);
      let filteredReports = [...mockReports];
      
      if (filters?.dangerType) {
        filteredReports = filteredReports.filter(r => r.dangerType === filters.dangerType);
      }
      if (filters?.severity) {
        filteredReports = filteredReports.filter(r => r.severity === filters.severity);
      }
      if (filters?.status) {
        filteredReports = filteredReports.filter(r => r.status === filters.status);
      }
      if (filters?.limit) {
        filteredReports = filteredReports.slice(0, filters.limit);
      }
      
      return { reports: filteredReports };
    }

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
    const reports = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        location: {
          latitude: data.location?.latitude || 0,
          longitude: data.location?.longitude || 0,
          address: data.location?.address
        },
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        resolvedAt: data.resolvedAt?.toDate()
      };
    }) as Report[];

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { reports, lastDoc };
  }

  async getReportById(reportId: string): Promise<Report | null> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Récupération signalement', reportId);
      return mockReports.find(r => r.id === reportId) || null;
    }

    const docRef = doc(db, 'reports', reportId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        location: {
          latitude: data.location?.latitude || 0,
          longitude: data.location?.longitude || 0,
          address: data.location?.address
        },
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        resolvedAt: data.resolvedAt?.toDate()
      } as Report;
    }
    return null;
  }

  async updateReport(reportId: string, data: Partial<Report>): Promise<void> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Mise à jour signalement', reportId, data);
      const reportIndex = mockReports.findIndex(r => r.id === reportId);
      if (reportIndex !== -1) {
        mockReports[reportIndex] = { ...mockReports[reportIndex], ...data, updatedAt: new Date() };
      }
      return;
    }

    const docRef = doc(db, 'reports', reportId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteReport(reportId: string): Promise<void> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Suppression signalement', reportId);
      const reportIndex = mockReports.findIndex(r => r.id === reportId);
      if (reportIndex !== -1) {
        mockReports.splice(reportIndex, 1);
      }
      return;
    }

    const docRef = doc(db, 'reports', reportId);
    await deleteDoc(docRef);
  }

  // Votes
  async createVote(voteData: Omit<ReportVote, 'id' | 'createdAt'>): Promise<string> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Création vote', voteData);
      return 'mock-vote-id';
    }

    const docRef = await addDoc(collection(db, 'reportVotes'), {
      ...voteData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async getUserVote(userId: string, reportId: string): Promise<ReportVote | null> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Récupération vote utilisateur', userId, reportId);
      return null; // Pas de vote existant en mode test
    }

    const q = query(
      collection(db, 'reportVotes'),
      where('userId', '==', userId),
      where('reportId', '==', reportId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as ReportVote;
    }
    return null;
  }

  async deleteVote(voteId: string): Promise<void> {
    if (DEV_MODE) {
      console.log('🧪 Mock: Suppression vote', voteId);
      return;
    }

    const docRef = doc(db, 'reportVotes', voteId);
    await deleteDoc(docRef);
  }
}

export const firestoreService = new FirestoreService(); 