import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  QrCode,
  Wallet,
  Gift,
  Store,
  Shield,
  LogOut,
  Sparkles,
  ChevronDown,
  Globe,
  Share2,
  Receipt,
  Check,
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
  const location = useLocation();
  const navigate = useNavigate();

  const handleDemoSwitch = async (account) => {
    setIsDemoMenuOpen(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <span className="text-xl">🎁</span>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-lg tracking-tight text-slate-900">
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
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-200">
                      {t('currencyCode')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {t('brandSubtitle')}
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/')
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4 inline-block mr-1.5 mb-0.5 text-emerald-600" />
                {t('navMerchants')}
              </Link>

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
                <>
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
                </>
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
            <div className="flex items-center space-x-2">
              {/* Language Selector Dropdown (Default Amharic) */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition-all"
                  title="ቋንቋ ይምረጡ / Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAmharic ? 'አማርኛ' : 'English'}</span>
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
                      <span>🇪🇹 አማርኛ (መደበኛ)</span>
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
                  {/* Digital Card Trigger (For customers) */}
                  <button
                    onClick={() => setIsCardOpen(true)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm shadow-emerald-600/20 hover:from-emerald-700 hover:to-emerald-600 transition-all font-semibold text-xs"
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('myPass')}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-lg text-emerald-50 font-bold">
                      {(user.pointsBalance || 0).toLocaleString()} {t('pointsShort')}
                    </span>
                  </button>

                  {/* Demo Switcher Quick Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                      className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden lg:inline">{t('demoRoles')}</span>
                      <ChevronDown className="w-3 h-3 text-amber-700" />
                    </button>

                    {isDemoMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50 animate-scale-up">
                        <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                              <p className="text-[10px] text-slate-400">{acc.phone}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
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
                      className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                        {user.name?.charAt(0) || 'U'}
                      </div>
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
                              {(user.pointsBalance || 0) * 0.1} {t('currency')}
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
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    {t('signIn')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
                  >
                    {t('getStarted')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Digital Loyalty Pass Modal */}
      <DigitalCardModal isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />
    </>
  );
};
