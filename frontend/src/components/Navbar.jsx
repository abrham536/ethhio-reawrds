import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Wallet,
  Gift,
  Home,
  Shield,
  LogOut,
  Sparkles,
  ChevronDown,
  Globe,
  Share2,
  Receipt,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { DigitalCardModal } from './DigitalCardModal';

export const Navbar = () => {
  const {
    user,
    logout,
    switchDemoAccount,
    lang,
    isAmharic,
    toggleLanguage,
    changeLanguage,
    t,
  } = useAuth();

  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleDemoSwitch = async (account) => {
    setIsDemoMenuOpen(false);
    setIsMobileMenuOpen(false);
    await switchDemoAccount(account);
    if (account.role === 'merchant_cashier') {
      navigate('/merchant/pos');
    } else if (account.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 group shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <span className="text-lg sm:text-xl">🎁</span>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                      {isAmharic ? (
                        <>
                          ኢትዮ<span className="text-emerald-600">ሪዋርድስ</span>
                        </>
                      ) : (
                        <>
                          Ethio<span className="text-emerald-600">Rewards</span>
                        </>
                      )}
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-200">
                      {t('currencyCode')}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium hidden sm:block">
                    {t('brandSubtitle')}
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/')
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 inline-block mr-1.5 mb-0.5 text-emerald-600" />
                {t('navHome')}
              </Link>

              {user?.role === 'customer' && (
                <>
                  <Link
                    to="/finance"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/finance')
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4 inline-block mr-1.5 mb-0.5 text-emerald-600" />
                    {t('navFinance')}
                  </Link>

                  <Link
                    to="/wallet"
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive('/wallet')
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 inline-block mr-1.5 mb-0.5 text-blue-500" />
                    {t('navWallet')}
                  </Link>
                </>
              )}

              <Link
                to="/redeem"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/redeem')
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Gift className="w-4 h-4 inline-block mr-1.5 mb-0.5 text-amber-500" />
                {t('navRedeem')}
              </Link>

              {user?.role === 'customer' && (
                <Link
                  to="/referrals"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive('/referrals')
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Share2 className="w-4 h-4 inline-block mr-1.5 mb-0.5 text-purple-500" />
                  {t('navReferrals')}
                </Link>
              )}

              {(user?.role === 'merchant_cashier' ||
                user?.role === 'merchant_admin' ||
                user?.role === 'admin') && (
                <Link
                  to="/merchant/pos"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive('/merchant/pos')
                      ? 'bg-amber-50 text-amber-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Receipt className="w-4 h-4 inline-block mr-1.5 mb-0.5 text-amber-600" />
                  {t('navPos')}
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive('/admin/dashboard')
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4 inline-block mr-1.5 mb-0.5 text-indigo-600" />
                  {t('navAdmin')}
                </Link>
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Language Selector Dropdown (Default Amharic) */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition-all"
                  title="ቋንቋ ይምረጡ / Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">{isAmharic ? 'አማርኛ' : 'EN'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-scale-up">
                    <button
                      onClick={() => {
                        changeLanguage('am');
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                        isAmharic ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>🇪🇹 አማርኛ</span>
                      {isAmharic && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                        !isAmharic ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>🇬🇧 English</span>
                      {!isAmharic && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  </div>
                )}
              </div>

              {user ? (
                <>
                  {/* Digital Card Trigger (Desktop) */}
                  <button
                    onClick={() => setIsCardOpen(true)}
                    className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-xs font-semibold text-xs hover:from-emerald-700 hover:to-emerald-600 transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{t('myPass')}</span>
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {(user.pointsBalance || 0).toLocaleString()}
                    </span>
                  </button>

                  {/* Demo Switcher Quick Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                      className="flex items-center space-x-1 px-2 py-1.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors"
                      title={t('demoRoles')}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden xl:inline">{t('demoRoles')}</span>
                      <ChevronDown className="w-3 h-3 text-amber-700" />
                    </button>

                    {isDemoMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50 animate-scale-up">
                        <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {isAmharic ? 'በ 1-ክሊክ ሚና ይቀይሩ' : 'Switch Role (1-Click)'}
                        </div>
                        {DEMO_ACCOUNTS.map((acc, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDemoSwitch(acc)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-slate-800">
                                {isAmharic ? acc.labelAmharic : acc.label}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">{acc.phone}</p>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-100">
                              {isAmharic ? acc.tagAmharic : acc.tag}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* User Profile dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center hover:bg-slate-900 transition-colors"
                    >
                      {user.name?.charAt(0) || 'U'}
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50 animate-scale-up">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="font-bold text-xs text-slate-800">{user.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{user.phone}</p>
                          <div className="mt-1 flex items-center space-x-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                              {user.tier || 'Member'}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600">
                              {(user.walletBalanceETB || 0).toLocaleString()} {t('currency')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('signOut')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link
                    to="/login"
                    className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    {t('signIn')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
                  >
                    {t('getStarted')}
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
            {user && (
              <div className="p-3 mb-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-xs text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{user.phone}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600">
                    {(user.walletBalanceETB || 0).toLocaleString()} {t('currency')}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {(user.pointsBalance || 0).toLocaleString()} {t('pointsShort')}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-xl flex items-center space-x-2 ${
                  isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 text-emerald-600" />
                <span>{t('navHome')}</span>
              </Link>

              <Link
                to="/finance"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-xl flex items-center space-x-2 ${
                  isActive('/finance') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>{t('navFinance')}</span>
              </Link>

              <Link
                to="/wallet"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-xl flex items-center space-x-2 ${
                  isActive('/wallet') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-4 h-4 text-blue-500" />
                <span>{t('navWallet')}</span>
              </Link>

              <Link
                to="/redeem"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-xl flex items-center space-x-2 ${
                  isActive('/redeem') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Gift className="w-4 h-4 text-amber-500" />
                <span>{t('navRedeem')}</span>
              </Link>

              <Link
                to="/referrals"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2.5 rounded-xl flex items-center space-x-2 ${
                  isActive('/referrals') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Share2 className="w-4 h-4 text-purple-500" />
                <span>{t('navReferrals')}</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl flex items-center space-x-2 ${
                    isActive('/admin/dashboard')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>{t('navAdmin')}</span>
                </Link>
              )}

              {(user?.role === 'merchant_cashier' ||
                user?.role === 'merchant_admin' ||
                user?.role === 'admin') && (
                <Link
                  to="/merchant/pos"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl flex items-center space-x-2 ${
                    isActive('/merchant/pos')
                      ? 'bg-amber-50 text-amber-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Receipt className="w-4 h-4 text-amber-600" />
                  <span>{t('navPos')}</span>
                </Link>
              )}
            </div>

            {user && (
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCardOpen(true);
                  }}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{t('myPass')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="py-2 px-4 rounded-xl bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100"
                >
                  {t('signOut')}
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Fixed Bottom Navigation Bar for Mobile Phones */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex justify-around items-center shadow-lg safe-bottom">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            isActive('/') ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>{t('navHome')}</span>
        </Link>

        <Link
          to="/finance"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            isActive('/finance') ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 mb-0.5" />
          <span>{isAmharic ? 'ገንዘብ' : 'Finance'}</span>
        </Link>

        {/* Center QR Card Icon button */}
        <button
          onClick={() => setIsCardOpen(true)}
          className="flex flex-col items-center -mt-4 bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white p-2.5 rounded-full shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
          aria-label="QR Pass"
        >
          <QrCode className="w-5 h-5" />
        </button>

        <Link
          to="/wallet"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            isActive('/wallet') ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <Wallet className="w-4 h-4 mb-0.5" />
          <span>{t('navWallet')}</span>
        </Link>

        <Link
          to="/redeem"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            isActive('/redeem') ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <Gift className="w-4 h-4 mb-0.5" />
          <span>{isAmharic ? 'ቀይር' : 'Redeem'}</span>
        </Link>
      </nav>

      {/* Digital Loyalty Pass Modal */}
      <DigitalCardModal isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />
    </>
  );
};