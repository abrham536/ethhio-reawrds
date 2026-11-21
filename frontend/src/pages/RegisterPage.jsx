import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Phone,
  Lock,
  User,
  Tag,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Gift,
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
    '';

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (confirmPassword && password !== confirmPassword) {
      setError(
        isAmharic
          ? 'የይለፍ ቃሎቹ አይመሳሰሉም። እባክዎ በትክክል ያስገቡ።'
          : 'Passwords do not match.'
      );
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim() || `User-${cleanPhone.slice(-4)}`,
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile-App Styled Shell (PGLife style, No OTP) */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-emerald-600/25">
            🎁
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAmharic ? 'አዲስ አካውንት ይክፈቱ' : 'Create Account'}
          </h1>
          <p className="text-xs text-emerald-700 font-bold bg-emerald-50 py-1 px-3 rounded-full inline-block border border-emerald-100">
            {isAmharic ? '🎉 100 ነፃ ነጥብ (10 ብር) ወዲያውኑ ያግኙ!' : '🎉 Get 100 Free Welcome Points Instantly!'}
          </p>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs font-bold">
          <Link
            to="/login"
            className="py-2.5 rounded-xl text-slate-500 hover:text-slate-900 text-center transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>{isAmharic ? 'መግቢያ (Log in)' : 'Log in'}</span>
          </Link>
          <button
            type="button"
            className="py-2.5 rounded-xl bg-white text-emerald-700 shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{isAmharic ? 'ምዝገባ (Register)' : 'Register'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2 animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Simple Registration Form (NO OTP Required!) */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Phone Number with +251 country prefix */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
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
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-slate-900 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Full Name / Nickname */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAmharic ? 'ሙሉ ስም / ቅጽል ስም' : 'Full Name / Nickname'}
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 overflow-hidden bg-slate-50/50 transition-colors">
              <div className="pl-3.5 text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Abreham Tadesse"
                className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAmharic ? 'የይለፍ ቃል ፍጠር' : 'Create Password'}
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 overflow-hidden bg-slate-50/50 transition-colors">
              <div className="pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAmharic ? 'የይለፍ ቃል አረጋግጥ' : 'Confirm Password'}
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 overflow-hidden bg-slate-50/50 transition-colors">
              <div className="pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Invitation Code (Auto-populated from URL) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAmharic ? 'የመጋበዣ ኮድ (Invitation Code)' : 'Invitation Code'}
            </label>
            <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 overflow-hidden bg-slate-50/50 transition-colors">
              <div className="pl-3.5 text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                placeholder="e.g. F7337056AD"
                className="w-full px-3 py-2.5 text-xs sm:text-sm font-mono font-bold uppercase text-slate-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isAmharic ? 'አካውንት ፍጠር (Create Account)' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500">
          {isAmharic ? 'ቀደም ሲል አካውንት አለዎት?' : 'Already have an account?'}{' '}
          <Link to="/login" className="font-extrabold text-emerald-600 hover:underline">
            {isAmharic ? 'ይግቡ (Log in)' : 'Log in'}
          </Link>
        </div>
      </div>
    </div>
  );
};