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

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
} 