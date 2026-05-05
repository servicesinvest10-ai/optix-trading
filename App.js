import '@/App.css';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { MarketTicker } from '@/components/MarketTicker';
import { ProductTabsSection } from '@/components/ProductTabsSection';
import { MarketsSection } from '@/components/MarketsSection';
import { PlatformShowcase } from '@/components/PlatformShowcase';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { TrustSection } from '@/components/TrustSection';
import { EducationSection } from '@/components/EducationSection';
import { Footer } from '@/components/Footer';
import { Dashboard } from '@/pages/Dashboard';
import { AdminCRM } from '@/pages/AdminCRM';
import { useEffect } from 'react';

// Landing Page Component
const LandingPage = () => {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <MarketTicker />
        <ProductTabsSection />
        <MarketsSection />
        <PlatformShowcase />
        <HowItWorksSection />
        <TrustSection />
        <EducationSection />
        <Footer />
      </div>
    </>
  );
};

// Main App Content - decides what to show based on auth state
const AppContent = () => {
  const { user, logout, isLoading } = useAuth();

  // Show loading state briefly while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#d4af37]">Chargement...</p>
        </div>
      </div>
    );
  }

  // If user is logged in
  if (user) {
    // Check if user is admin - show Admin CRM
    if (user.role === 'admin') {
      return <AdminCRM onLogout={logout} />;
    }
    // Regular user - show Trading Dashboard
    return <Dashboard onLogout={logout} />;
  }

  // Not logged in - show landing page
  return <LandingPage />;
};

function App() {
  useEffect(() => {
    // Ignore browser extension errors (e.g., MetaMask, crypto wallets)
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('ethereum') || 
         args[0].includes('chrome-extension') ||
         args[0].includes('which has only a getter'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    window.addEventListener('error', (e) => {
      if (
        e.message.includes('ethereum') ||
        e.filename?.includes('chrome-extension') ||
        e.message.includes('which has only a getter')
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
    });
  }, []);

  return (
    <AuthProvider>
      <div className="App min-h-screen relative">
        <AppContent />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
