import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, isAmharic, t } = useAuth();
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
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Neon Emerald Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="w-full max-w-sm mb-4 text-left space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-emerald-500/30 mb-3">
          P&G
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          {isAmharic ? 'ወደ አካውንትዎ ይግቡ' : 'Log in'}
        </h1>
        <p className="text-xs text-slate-400">
          {isAmharic ? 'ወደ P&G እንኳን ደህና መጡ' : 'Welcome back to P&G'}
        </p>
      </div>

      {/* Dark Cyberpunk Neon Card matching Screenshot */}
      <div className="w-full max-w-sm bg-[#0f172a] rounded-3xl border border-emerald-500/30 p-6 shadow-2xl shadow-emerald-950/40 relative z-10 space-y-5">
        {/* Tab switch: [ Log in ] [ Sign up ] */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-black">
          <button
            type="button"
            className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/30 transition-all flex items-center justify-center font-black"
          >
            <span>Log in</span>
          </button>
          <Link
            to="/register"
            className="py-2.5 rounded-xl text-slate-400 hover:text-white text-center transition-colors flex items-center justify-center"
          >
            <span>Sign up</span>
          </Link>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center space-x-2 animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form (NO OTP) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PHONE NUMBER */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
              PHONE NUMBER
            </label>
            <div className="flex rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 overflow-hidden transition-colors">
              <span className="inline-flex items-center px-3.5 bg-slate-950 text-slate-300 font-mono font-bold text-xs border-r border-slate-800 shrink-0">
                +251
              </span>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="911333333"
                className="w-full px-3.5 py-3 text-xs sm:text-sm font-mono font-bold text-white bg-transparent focus:outline-none placeholder-slate-600"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
              PASSWORD
            </label>
            <div className="relative flex items-center rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 overflow-hidden transition-colors">
              <div className="pl-3.5 text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-3 text-xs sm:text-sm font-semibold text-white bg-transparent focus:outline-none placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 active:scale-98 transition-all disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Log in</span>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts Selector */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowDemoList(!showDemoList)}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-between border border-slate-800 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAmharic ? 'የሙከራ አካውንቶች (1-ክሊክ መግቢያ)' : 'Quick 1-Click Demo Accounts'}</span>
            </span>
            <span className="text-amber-400 font-bold">{showDemoList ? '▲' : '▼'}</span>
          </button>

          {showDemoList && (
            <div className="mt-2 space-y-1.5 animate-scale-up">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickDemo(acc)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-200 block">
                      {isAmharic ? acc.labelAmharic : acc.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{acc.phone}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {acc.tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer switch to Register */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-emerald-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
