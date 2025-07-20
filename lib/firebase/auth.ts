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
    if (typeof window === 'undefined') return;
    
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