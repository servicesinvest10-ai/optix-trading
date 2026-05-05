import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const AuthModal = ({ isOpen, onClose, mode: initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password,
        });
        toast.success('Connexion réussie !');
      } else {
        await register(formData);
        toast.success('Compte créé avec succès !');
      }
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(
        mode === 'login'
          ? 'Email ou mot de passe incorrect'
          : 'Erreur lors de la création du compte'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'login'
              ? 'Connectez-vous pour accéder à votre compte'
              : 'Créez votre compte de trading gratuit'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-foreground">
                  Nom complet
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Téléphone (optionnel)
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Mot de passe
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-background border-border text-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Pas encore de compte ?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-primary hover:underline"
              >
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-primary hover:underline"
              >
                Se connecter
              </button>
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          ⚠️ <strong>Prototype démo uniquement</strong> - Pas de vraies transactions
        </div>
      </DialogContent>
    </Dialog>
  );
};
