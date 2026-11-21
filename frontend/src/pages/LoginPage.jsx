import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, QrCode, Store } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, isAmharic, t } = useAuth();
  const [loginId, setLoginId] = useState('+251911333333');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
          (isAmharic ? 'መግባት አልተቻለም። እባክዎ መረጃዎን ያረጋግጡ።' : 'Login failed. Please check credentials.')
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
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center text-white text-2xl mx-auto shadow-md shadow-emerald-500/20 mb-3">
            🎁
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('loginTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('loginSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('loginPhoneOrEmail')}
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="+251911223344"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('loginPassword')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all"
          >
            {loading ? '...' : t('loginBtn')}
          </button>
        </form>

        {/* 1-Click Quick Demo Login Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
            {t('quickDemoTitle')}
          </p>
          <div className="space-y-2">
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
                  <span className="truncate">
                    {isAmharic ? acc.labelAmharic : acc.label}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

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
