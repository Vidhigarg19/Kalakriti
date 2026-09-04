import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from '@/lib/store';
import { Navigation } from '@/components/Navigation';
import { Footer, WorkflowStrip } from '@/components/Footer';
import { DemoBadge, OfflineBanner } from '@/components/DemoBadge';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { PartnersPage } from '@/pages/PartnersPage';
import { AuthPage } from '@/pages/AuthPage';
import { ArtisanDashboard } from '@/pages/artisan/ArtisanDashboard';
import { ArtisanProducts } from '@/pages/artisan/ArtisanProducts';
import { NewProductPage } from '@/pages/artisan/NewProductPage';
import { ArtisanProductDetail } from '@/pages/artisan/ArtisanProductDetail';
import { ArtisanInquiries } from '@/pages/artisan/ArtisanInquiries';
import { ArtisanProfile } from '@/pages/artisan/ArtisanProfile';
import { BuyerFavorites } from '@/pages/buyer/BuyerFavorites';
import { BuyerInquiries } from '@/pages/buyer/BuyerInquiries';
import { FacilitatorPage } from '@/pages/FacilitatorPage';
import { AdminPage } from '@/pages/AdminPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:productId" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/artisan" element={<AuthPage initialRole="artisan" />} />
        <Route path="/auth/buyer" element={<AuthPage initialRole="buyer" />} />

        <Route path="/artisan/dashboard" element={
          <ProtectedRoute roles={['artisan']}><ArtisanDashboard /></ProtectedRoute>
        } />
        <Route path="/artisan/products" element={
          <ProtectedRoute roles={['artisan']}><ArtisanProducts /></ProtectedRoute>
        } />
        <Route path="/artisan/products/new" element={
          <ProtectedRoute roles={['artisan']}><NewProductPage /></ProtectedRoute>
        } />
        <Route path="/artisan/products/:productId" element={
          <ProtectedRoute roles={['artisan']}><ArtisanProductDetail /></ProtectedRoute>
        } />
        <Route path="/artisan/inquiries" element={
          <ProtectedRoute roles={['artisan']}><ArtisanInquiries /></ProtectedRoute>
        } />
        <Route path="/artisan/profile" element={
          <ProtectedRoute roles={['artisan']}><ArtisanProfile /></ProtectedRoute>
        } />

        <Route path="/buyer/favorites" element={
          <ProtectedRoute roles={['buyer']}><BuyerFavorites /></ProtectedRoute>
        } />
        <Route path="/buyer/inquiries" element={
          <ProtectedRoute roles={['buyer']}><BuyerInquiries /></ProtectedRoute>
        } />

        <Route path="/facilitator" element={
          <ProtectedRoute roles={['facilitator']}><FacilitatorPage /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-hero grain-overlay">
          <OfflineBanner />
          <Navigation />
          <main className="flex-1 pt-16">
            <AnimatedRoutes />
          </main>
          <Footer />
          <DemoBadge />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
