import React, { useState } from 'react';
import { Share2, Copy, Check, Users, Gift, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export const ReferralsPage = () => {
  const { user, isAmharic, t } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || 'ETHIOREWARDS';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 pb-24 lg:pb-12">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-10 shadow-xl overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-3 border border-white/20">
              <Gift className="w-3.5 h-3.5" />
              <span>{t('navReferrals')}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {t('referralTitle')}
            </h1>

            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t('referralSubtitle')}
            </p>

            {/* Code Box */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 font-mono font-black text-xl tracking-widest text-amber-300 text-center sm:text-left">
                {referralCode}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t('copied') : t('btnCopyCode')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 font-black text-lg flex items-center justify-center mx-auto mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">{t('referStep1Title')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              {t('referStep1Desc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-black text-lg flex items-center justify-center mx-auto mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">{t('referStep2Title')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              {t('referStep2Desc')}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-black text-lg flex items-center justify-center mx-auto mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">{t('referStep3Title')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              {t('referStep3Desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
