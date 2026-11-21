import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  Bell,
  BookOpen,
  User as UserIcon,
  Globe,
  Check,
  ChevronDown,
  Sparkles,
  LogOut,
  Shield,
  Receipt,
  Headphones,
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export const Navbar = () => {
  const {
    user,
    logout,
    switchDemoAccount,
    isAmharic,
    changeLanguage,
    t,
  } = useAuth();

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
      {/* Top Header for Desktop & Mobile Header Bar */}
      <header className="sticky top-0 z-40 bg-[#080d1a]/95 backdrop-blur-md border-b border-slate-800/80 shadow-md">
        <div className="max-w-lg lg:max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 group shrink-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  P&G
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-black text-sm tracking-tight text-white">
                      Ethio<span className="text-emerald-400">Rewards</span>
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      VIP
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links (For Large screens) */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive('/')
                    ? 'bg-emerald-500/20 text-emerald-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isAmharic ? 'ዋና ገጽ' : 'Home'}
              </Link>

              <Link
                to="/invest"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive('/invest')
                    ? 'bg-emerald-500/20 text-emerald-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isAmharic ? 'ኢንቨስትመንት' : 'Invest'}
              </Link>

              <Link
                to="/notice"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive('/notice')
                    ? 'bg-emerald-500/20 text-emerald-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isAmharic ? 'ማስታወቂያ' : 'Notice'}
              </Link>

              <Link
                to="/blog"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive('/blog')
                    ? 'bg-emerald-500/20 text-emerald-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isAmharic ? 'ብሎግ' : 'Blog'}
              </Link>

              <Link
                to="/account"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive('/account')
                    ? 'bg-emerald-500/20 text-emerald-400 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isAmharic ? 'አካውንት' : 'Account'}
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive('/admin/dashboard')
                      ? 'bg-indigo-500/20 text-indigo-400 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Right actions: Language Switcher, Demo accounts, User avatar */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-all"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-bold">{isAmharic ? 'አማርኛ' : 'EN'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-2xl bg-[#0f172a] shadow-2xl border border-slate-800 py-1.5 z-50">
                    <button
                      onClick={() => {
                        changeLanguage('am');
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-slate-800 ${
                        isAmharic ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span>🇪🇹 አማርኛ</span>
                      {isAmharic && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-slate-800 ${
                        !isAmharic ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span>🇬🇧 English</span>
                      {!isAmharic && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Demo Switcher Quick Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                  title="Demo Switcher"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px] font-bold">Demo</span>
                  <ChevronDown className="w-3 h-3 text-amber-400" />
                </button>

                {isDemoMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0f172a] shadow-2xl border border-slate-800 py-2 z-50">
                    <div className="px-3 py-1 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {isAmharic ? 'በ 1-ክሊክ ሚና ይቀይሩ' : 'Switch Role (1-Click)'}
                    </div>
                    {DEMO_ACCOUNTS.map((acc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDemoSwitch(acc)}
                        className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-200">
                            {isAmharic ? acc.labelAmharic : acc.label}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">{acc.phone}</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                          {acc.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Avatar / Profile Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    {user.name?.charAt(0) || 'U'}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0f172a] shadow-2xl border border-slate-800 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="font-bold text-xs text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{user.phone}</p>
                        <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          VIP {user.vipLevel || 0}
                        </span>
                      </div>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-indigo-400 hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center space-x-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{isAmharic ? 'ውጣ' : 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Link
                    to="/login"
                    className="px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    {isAmharic ? 'ግባ' : 'Sign in'}
                  </Link>
                  <Link
                    to="/register"
                    className="px-2.5 py-1 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  >
                    {isAmharic ? 'ተመዝገብ' : 'Register'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 5-Item Bottom App Bar matching Screenshot Exactly */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080d1a]/95 backdrop-blur-md border-t border-slate-800/90 py-1.5 px-3 flex justify-around items-center shadow-2xl safe-bottom max-w-lg mx-auto">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-black transition-all ${
            isActive('/') ? 'text-emerald-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {isActive('/') && <div className="w-4 h-0.5 rounded-full bg-emerald-400 mb-1" />}
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </Link>

        {/* 2. Invest */}
        <Link
          to="/invest"
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-black transition-all ${
            isActive('/invest') ? 'text-emerald-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {isActive('/invest') && <div className="w-4 h-0.5 rounded-full bg-emerald-400 mb-1" />}
          <TrendingUp className="w-4 h-4 mb-0.5" />
          <span>Invest</span>
        </Link>

        {/* 3. Notice */}
        <Link
          to="/notice"
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-black transition-all ${
            isActive('/notice') ? 'text-emerald-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {isActive('/notice') && <div className="w-4 h-0.5 rounded-full bg-emerald-400 mb-1" />}
          <Bell className="w-4 h-4 mb-0.5" />
          <span>Notice</span>
        </Link>

        {/* 4. Blog */}
        <Link
          to="/blog"
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-black transition-all ${
            isActive('/blog') ? 'text-emerald-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {isActive('/blog') && <div className="w-4 h-0.5 rounded-full bg-emerald-400 mb-1" />}
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Blog</span>
        </Link>

        {/* 5. Account */}
        <Link
          to="/account"
          className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-black transition-all ${
            isActive('/account') ? 'text-emerald-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {isActive('/account') && <div className="w-4 h-0.5 rounded-full bg-emerald-400 mb-1" />}
          <UserIcon className="w-4 h-4 mb-0.5" />
          <span>Account</span>
        </Link>
      </nav>
    </>
  );
};
