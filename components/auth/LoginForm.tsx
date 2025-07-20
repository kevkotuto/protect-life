'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/Logo';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Phone } from 'lucide-react';

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
      toast.success('Code envoyé par SMS !');
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast.error('Erreur lors de l\'envoi du code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await verifyCode(verificationCode);
      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast.error('Code incorrect ou expiré');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <CardTitle className="text-2xl font-bold">Protect Life</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Connectez-vous avec votre numéro de téléphone'
              : 'Entrez le code reçu par SMS'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Format international requis (ex: +33 pour la France)
                </p>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Envoi...' : 'Envoyer le code'}
              </Button>
              <div id="recaptcha-container"></div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code de vérification</Label>
                <Input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
                <p className="text-xs text-gray-500">
                  Code envoyé au {phoneNumber}
                </p>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Vérification...' : 'Se connecter'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('phone')}
                className="w-full"
              >
                Retour
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 