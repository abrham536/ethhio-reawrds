import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, Sparkles, User, Phone, Lock, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register, isAmharic, t } = useAuth();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    referralCodeInput: searchParams.get('ref') || '',
    city: 'Addis Ababa',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (isAmharic ? 'መመዝገብ አልተቻለም። እባክዎ እንደገና ይሞክሩ።' : 'Registration failed.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl">
        {/* Title & Welcome */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 flex items-center justify-center text-white text-2xl mx-auto shadow-md shadow-emerald-500/20 mb-3">
            🎁
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('registerTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('registerSubtitle')}
          </p>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
          <Link
            to="/login"
            className="flex-1 py-2 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-900 text-center transition-colors"
          >
            {t('signIn')}
          </Link>
          <button
            type="button"
            className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-900 shadow-xs"
          >
            {t('getStarted')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {/* Simple Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('fullName')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Abreham Tadesse"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                required
              />
            </div>
          </div>

          {/* Ethiopian Phone Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('ethioPhone')}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+251911223344"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('createPassword')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Optional Referral Code */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('referralCodeOptional')}
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.referralCodeInput}
                onChange={(e) => setFormData({ ...formData, referralCodeInput: e.target.value })}
                placeholder="ABRHAM99"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{t('btnRegister')}</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          {t('alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:underline">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};