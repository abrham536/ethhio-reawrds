import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Gift } from 'lucide-react';
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
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl">
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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('fullName')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Abreham Tadesse"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('ethioPhone')}
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+251911223344"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('createPassword')}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t('referralCodeOptional')}
            </label>
            <input
              type="text"
              value={formData.referralCodeInput}
              onChange={(e) => setFormData({ ...formData, referralCodeInput: e.target.value })}
              placeholder="e.g. ABRHAM99"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all"
          >
            {loading ? '...' : t('btnRegister')}
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
