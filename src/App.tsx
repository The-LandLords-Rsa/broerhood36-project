import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { ProductDetailModal } from './components/ProductDetailModal';
import { AgeGateModal } from './components/AgeGateModal';
import { PhoneCompareModal } from './components/PhoneCompareModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';
import { ProjectDownloadModal } from './components/ProjectDownloadModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { SneakersPage } from './pages/SneakersPage';
import { PhonesPage } from './pages/PhonesPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { FootballPage } from './pages/FootballPage';
import { HubbliesPage } from './pages/HubbliesPage';
import { ShishaAccessoriesPage } from './pages/ShishaAccessoriesPage';
import { VapesPage } from './pages/VapesPage';
import { RentalsPage } from './pages/RentalsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { EnquiryPage } from './pages/EnquiryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { isOwnerEmail } from './lib/ownerAccess';

const AppContent: React.FC = () => {
  const {
    activePage,
    navigateTo,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authUser,
    setAuthUser
  } = useShop();

  const isOwner = isOwnerEmail(authUser?.email);

  const renderActivePage = () => {
    switch (activePage) {
      case 'home': return <HomePage />;
      case 'shop': return <ShopPage />;
      case 'sneakers': return <SneakersPage />;
      case 'phones': return <PhonesPage />;
      case 'accessories': return <AccessoriesPage />;
      case 'football': return <FootballPage />;
      case 'hubblies': return <HubbliesPage />;
      case 'shisha-accessories': return <ShishaAccessoriesPage />;
      case 'vapes': return <VapesPage />;
      case 'rentals': return <RentalsPage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'enquiry':
      case 'enquiries': return <EnquiryPage />;
      case 'cart': return <CartPage />;
      case 'checkout': return <CheckoutPage />;
      case 'account': return <AccountPage />;
      case 'tracking': return <OrderTrackingPage />;
      case 'admin':
        // OWNER ONLY
        if (!isOwner) {
          return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
              <h1 className="text-2xl font-black text-white mb-2">Access Denied</h1>
              <p className="text-slate-400 text-sm mb-6">Admin access is limited to the approved owner accounts. Please sign in with an owner account.</p>
              <button onClick={() => navigateTo('home')} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm">Go Home</button>
            </div>
          );
        }
        return <AdminDashboardPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] flex flex-col bg-[#080a08] text-slate-100 selection:bg-green-600 selection:text-white antialiased overflow-x-hidden">
      <Navbar onOpenWishlist={() => navigateTo('account')} />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {renderActivePage()}
      </main>
      <Footer />
      <ProductDetailModal />
      <AgeGateModal />
      <PhoneCompareModal />
      <GlobalSearchModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={authUser}
        setUser={setAuthUser}
        onOwnerLogin={() => navigateTo('admin')}
        onOpenAdmin={() => navigateTo('admin')}
      />
      {/* Download ZIP modal - ONLY for owner */}
      {isOwner && <ProjectDownloadModal />}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
