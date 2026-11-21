import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CustomerHome } from './pages/customer/CustomerHome';
import { WalletPage } from './pages/customer/WalletPage';
import { RedeemPage } from './pages/customer/RedeemPage';
import { ReferralsPage } from './pages/customer/ReferralsPage';
import { POSPage } from './pages/merchant/POSPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Footer Component with Localization
const Footer = () => {
  const { t } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🎁</span>
          <span className="font-extrabold text-white text-sm">{t('appName')}</span>
          <span>• {t('addisAbaba')}</span>
        </div>
        <p className="text-slate-500 text-[11px]">
          {t('footerTagline')}
        </p>
        <div className="flex items-center space-x-4 text-slate-400">
          <span>ቴሌብር (Telebirr)</span>
          <span>•</span>
          <span>ኢትዮ ቴሌኮም (Ethio Telecom)</span>
          <span>•</span>
          <span>ሲቢኢ ብር (CBE Birr)</span>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-500 selection:text-white">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<CustomerHome />} />
              <Route
                path="/wallet"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <WalletPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/redeem" element={<RedeemPage />} />
              <Route
                path="/referrals"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <ReferralsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/merchant/pos"
                element={
                  <ProtectedRoute allowedRoles={['merchant_cashier', 'merchant_admin', 'admin']}>
                    <POSPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
