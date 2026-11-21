import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CustomerHome } from './pages/customer/CustomerHome';
import { InvestPage } from './pages/customer/InvestPage';
import { AccountPage } from './pages/customer/AccountPage';
import { WithdrawPage } from './pages/customer/WithdrawPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { NoticePage } from './pages/customer/NoticePage';
import { BlogPage } from './pages/customer/BlogPage';
import { FinancePage } from './pages/customer/FinancePage';
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
      <div className="min-h-screen flex items-center justify-center bg-[#080d1a]">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
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

// Sleek minimal footer
const Footer = () => {
  const { t } = useAuth();

  return (
    <footer className="bg-[#050811] text-slate-500 text-[11px] py-6 px-4 border-t border-slate-900/80 mb-14 lg:mb-0">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-[10px] font-black text-slate-950">
            P&G
          </div>
          <span className="font-black text-slate-300">EthioRewards P&G</span>
          <span>• Addis Ababa, Ethiopia</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-500 text-[10px]">
          <span>CBE Birr</span>
          <span>•</span>
          <span>Telebirr</span>
          <span>•</span>
          <span>BOA Mobile</span>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Core P&G Theme Screens */}
              <Route path="/" element={<CustomerHome />} />
              <Route path="/invest" element={<InvestPage />} />
              <Route path="/notice" element={<NoticePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/withdraw"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <WithdrawPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <FinancePage />
                  </ProtectedRoute>
                }
              />
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
