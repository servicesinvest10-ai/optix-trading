import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_financeportal-25/artifacts/063k1u8o_image.png';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountType, setAccountType] = useState('demo');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Marchés', href: '#markets' },
    { name: 'Plateforme', href: '#platform' },
    { name: 'Analyse', href: '#analysis' },
    { name: 'Formation', href: '#education' },
    { name: 'À propos', href: '#about' },
  ];

  const handleLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="#" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 flex items-center justify-center relative">
                  <img 
                    src={LOGO_URL} 
                    alt="Optix Royal" 
                    className="w-full h-full object-contain group-hover:animate-gold-glow transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Cinzel, serif' }}>
                    OPTIX ROYAL
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    Elite Trading
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 hover:bg-muted/50 rounded-md"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Account Type Toggle */}
                  <div className="flex items-center bg-card border border-border rounded-lg p-1">
                    <button
                      onClick={() => setAccountType('demo')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                        accountType === 'demo'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Démo: ${user?.demo_balance?.toFixed(2) || '10,000.00'}
                    </button>
                    <button
                      onClick={() => setAccountType('real')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                        accountType === 'real'
                          ? 'bg-primary text-primary-foreground glow-gold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Réel: ${user?.real_balance?.toFixed(2) || '0.00'}
                    </button>
                  </div>

                  {/* User Menu */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{user?.email?.split('@')[0]}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-foreground border border-border hover:border-primary hover:text-primary" 
                    onClick={handleLogin}
                  >
                    Connexion
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold glow-gold"
                    onClick={handleRegister}
                  >
                    Compte Elite
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-foreground hover:bg-muted hover:text-primary"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 space-y-2 border-t border-border">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <button
                        onClick={() => setAccountType('demo')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          accountType === 'demo'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        Démo: ${user?.demo_balance?.toFixed(2)}
                      </button>
                      <button
                        onClick={() => setAccountType('real')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          accountType === 'real'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        Réel: ${user?.real_balance?.toFixed(2)}
                      </button>
                    </div>
                    <div className="text-center text-sm text-muted-foreground mb-2">
                      {user?.email}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-border"
                      size="sm"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-border"
                      size="sm"
                      onClick={() => {
                        handleLogin();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Connexion
                    </Button>
                    <Button
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                      size="sm"
                      onClick={() => {
                        handleRegister();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Compte Elite
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </>
  );
};
