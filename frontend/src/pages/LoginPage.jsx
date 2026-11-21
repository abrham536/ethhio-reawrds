import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, isAmharic, t } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('911333333');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoList, setShowDemoList] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Format phone to +251...
    let cleanPhone = phone.trim();
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '+251' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('+251') && !cleanPhone.includes('@')) {
      cleanPhone = '+251' + cleanPhone;
    }

    setLoading(true);
    try {
      const user = await login(cleanPhone, password);
      if (user.role === 'merchant_cashier') {
        navigate('/merchant/pos');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isAmharic ? 'መግባት አልተቻለም። ስልክ ወይም የይለፍ ቃልዎን ያረጋግጡ።' : 'Invalid credentials. Please check phone and password.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (acc) => {
    setLoading(true);
    try {
      const user = await login(acc.phone, acc.password);
      if (user.role === 'merchant_cashier') {
        navigate('/merchant/pos');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile-App Styled Shell */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-emerald-600/25">
            🎁
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAmharic ? 'እንኳን ደህና መጡ' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isAmharic
              ? 'ወደ ኢትዮ ሪዋርድስ አካውንትዎ ይግቡ እና ትርፍዎን ያስተዳድሩ'
              : 'Sign in to access your wallet, rewards & cashback'}
          </p>
        </div>

        {/* Tab switch between Login and Register (Simple PGLife style) */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs font-bold">
          <button
            type="button"
            className="py-2.5 rounded-xl bg-white text-emerald-700 shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{isAmharic ? 'መግቢያ (Log in)' : 'Log in'}</span>
          </button>
          <Link
            to="/register"
            className="py-2.5 rounded-xl text-slate-500 hover:text-slate-900 text-center transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>{isAmharic ? 'ምዝገባ (Register)' : 'Register'}</span>
          </Link>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2 animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form without OTP */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number with +251 country prefix */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isAmharic ? 'የስልክ ቁጥር' : 'Phone Number'}
            </label>
            <div className="flex rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 overflow-hidden bg-slate-50/50 transition-colors">
              <span className="inline-flex items-center px-3.5 bg-slate-100 text-slate-700 font-mono font-bold text-xs border-r border-slate-200 shrink-0">
                🇪🇹 +251
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="911223344"
                  className="w-full px-3.5 py-3 text-xs sm:text-sm font-mono font-bold text-slate-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password with Show/Hide Eye toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isAmharic ? 'የይለፍ ቃል' : 'Password'}
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 overflow-hidden bg-slate-50/50 transition-colors">
              <div className="pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-3 text-xs sm:text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isAmharic ? 'ግባ (Log in)' : 'Log in'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts for testing */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowDemoList(!showDemoList)}
            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 font-bold py-1.5"
          >
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('quickDemoTitle')}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoList ? 'rotate-180' : ''}`} />
          </button>

          {showDemoList && (
            <div className="mt-2 space-y-1.5">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickDemo(acc)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">
                      {isAmharic ? acc.tagAmharic : acc.tag}:
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isAmharic ? acc.labelAmharic : acc.label}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500">
          {isAmharic ? 'አካውንት የለዎትም?' : "Don't have an account?"}{' '}
          <Link to="/register" className="font-extrabold text-emerald-600 hover:underline">
            {isAmharic ? 'እዚህ ይመዝገቡ (Sign up)' : 'Sign up'}
          </Link>
        </div>
      </div>
    </div>
  );
};