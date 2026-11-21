import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, ArrowRight, ShieldCheck, Phone, Lock, ChevronDown } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, isAmharic, t } = useAuth();
  const [loginId, setLoginId] = useState('+251911333333');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoList, setShowDemoList] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(loginId, password);
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
          (isAmharic ? 'መግባት አልተቻለም። እባክዎ ስልክ/የይለፍ ቃልዎን ያረጋግጡ።' : 'Invalid credentials. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (acc) => {
    setLoginId(acc.phone);
    setPassword(acc.password);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl">
        {/* Logo and App Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center text-white text-2xl mx-auto shadow-md shadow-emerald-500/20 mb-3">
            🎁
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('appName')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('loginSubtitle')}
          </p>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-900 shadow-xs"
          >
            {t('signIn')}
          </button>
          <Link
            to="/register"
            className="flex-1 py-2 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-900 text-center transition-colors"
          >
            {t('getStarted')}
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {/* Simple Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {t('loginPhoneOrEmail')}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="+251911223344"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {t('loginPassword')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('signIn')}</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts Toggle */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowDemoList(!showDemoList)}
            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('quickDemoTitle')}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoList ? 'rotate-180' : ''}`} />
          </button>

          {showDemoList && (
            <div className="mt-3 space-y-1.5 animate-scale-up">
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
                    <span className="text-[11px] text-slate-500">
                      {isAmharic ? acc.labelAmharic : acc.label}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom switch to register */}
        <p className="text-center text-xs text-slate-500 mt-6">
          {t('noAccount')}{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            {t('registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};