import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Lock,
  User,
  Tag,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register, isAmharic, t } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pre-fill invitation code from URL query (e.g. ?invitation_code=F7337056AD or ?ref=...)
  const initialInvite =
    searchParams.get('invitation_code') ||
    searchParams.get('ref') ||
    searchParams.get('code') ||
    'F7337056AD';

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState(initialInvite);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialInvite) {
      setInvitationCode(initialInvite.toUpperCase());
    }
  }, [initialInvite]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Format Ethiopian phone to +251...
    let cleanPhone = phone.trim();
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '+251' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('+251')) {
      cleanPhone = '+251' + cleanPhone;
    }

    if (password.length < 6) {
      setError(
        isAmharic
          ? 'የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት።'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim() || `er-${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        password,
        referralCodeInput: invitationCode.trim().toUpperCase(),
      });
      // Direct instant login without OTP!
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isAmharic
            ? 'መመዝገብ አልተቻለም። ስልኩ ቀደም ሲል ተመዝግቦ ሊሆን ይችላል።'
            : 'Registration failed. Phone number may already be registered.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Neon Emerald Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header matching Screenshot 1 */}
      <div className="w-full max-w-sm mb-4 text-left space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-emerald-500/30 mb-3">
          P&G
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          {isAmharic ? 'አካውንት ይክፈቱ' : 'Create account'}
        </h1>
        <p className="text-xs text-slate-400">
          {isAmharic ? 'ወደ P&G ይቀላቀሉና ኢንቨስት ማድረግ ይጀምሩ' : 'Join P&G and start investing'}
        </p>
      </div>

      {/* Dark Cyberpunk Neon Card matching Screenshot */}
      <div className="w-full max-w-sm bg-[#0f172a] rounded-3xl border border-emerald-500/30 p-6 shadow-2xl shadow-emerald-950/40 relative z-10 space-y-5">
        {/* Tab switch: [ Log in ] [ Sign up ] */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-black">
          <Link
            to="/login"
            className="py-2.5 rounded-xl text-slate-400 hover:text-white text-center transition-colors flex items-center justify-center"
          >
            <span>Log in</span>
          </Link>
          <button
            type="button"
            className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/30 transition-all flex items-center justify-center font-black"
          >
            <span>Sign up</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center space-x-2 animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form (NO OTP Required!) */}
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
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="932441044"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
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

          {/* NICKNAME */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
              NICKNAME
            </label>
            <div className="relative flex items-center rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 overflow-hidden transition-colors">
              <div className="pl-3.5 text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="er"
                className="w-full px-3 py-3 text-xs sm:text-sm font-semibold text-white bg-transparent focus:outline-none placeholder-slate-600"
              />
            </div>
          </div>

          {/* INVITATION CODE */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
              INVITATION CODE
            </label>
            <div className="relative flex items-center rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-emerald-500 overflow-hidden transition-colors">
              <div className="pl-3.5 text-slate-500">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                placeholder="F7337056AD"
                className="w-full px-3 py-3 text-xs sm:text-sm font-mono font-bold text-emerald-400 bg-transparent focus:outline-none uppercase tracking-wider"
              />
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
              <span>Create account</span>
            )}
          </button>
        </form>

        {/* Footer switch to Log in */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-emerald-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
