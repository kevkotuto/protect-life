'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/lib/firebase/auth';
import { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mode de développement - mettre à true pour tester sans Firebase
const DEV_MODE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

// Utilisateur fictif pour les tests
const mockUser = {
  uid: 'test-user-123',
  phoneNumber: '+22507123456',
  displayName: 'Utilisateur Test',
  email: 'test@protect-life.com',
} as User;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_MODE) {
      // Mode développement : simuler un utilisateur connecté
      console.log('🧪 MODE TEST ACTIVÉ - Utilisateur fictif connecté');
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Mode normal : utiliser Firebase
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithPhone = async (phoneNumber: string) => {
    if (DEV_MODE) {
      // Mode test : simuler la connexion
      console.log('🧪 Simulation connexion SMS pour:', phoneNumber);
      return;
    }
    
    // Mode normal
    authService.initRecaptcha('recaptcha-container');
    await authService.sendVerificationCode(phoneNumber);
  };

  const verifyCode = async (code: string) => {
    if (DEV_MODE) {
      // Mode test : simuler la vérification
      console.log('🧪 Simulation vérification code:', code);
      setUser(mockUser);
      return;
    }
    
    // Mode normal
    const user = await authService.verifyCode(code);
    setUser(user);
  };

  const signOut = async () => {
    if (DEV_MODE) {
      // Mode test : simuler la déconnexion
      console.log('🧪 Simulation déconnexion');
      setUser(null);
      return;
    }
    
    // Mode normal
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