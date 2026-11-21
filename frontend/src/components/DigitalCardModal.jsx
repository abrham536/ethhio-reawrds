import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Sparkles, Award, ShieldCheck, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DigitalCardModal = ({ isOpen, onClose }) => {
  const { user, isAmharic, t } = useAuth();

  if (!isOpen || !user) return null;

  const points = user.pointsBalance || 0;
  const etbValue = (points * 0.1).toFixed(2);
  const tier = user.tier || 'Bronze';

  const getTierGradient = (tKey) => {
    switch (tKey) {
      case 'Platinum':
        return 'from-indigo-900 via-purple-900 to-slate-900 border-indigo-400';
      case 'Gold':
        return 'from-amber-900 via-amber-800 to-stone-900 border-amber-400';
      case 'Silver':
        return 'from-slate-800 via-slate-700 to-zinc-900 border-slate-300';
      default:
        return 'from-emerald-950 via-emerald-900 to-slate-900 border-emerald-500';
    }
  };

  const getTierMultiplier = (tKey) => {
    switch (tKey) {
      case 'Platinum':
        return '1.5x';
      case 'Gold':
        return '1.25x';
      case 'Silver':
        return '1.1x';
      default:
        return '1.0x';
    }
  };

  const getTierLocalized = (tKey) => {
    switch (tKey) {
      case 'Platinum':
        return t('tierPlatinum');
      case 'Gold':
        return t('tierGold');
      case 'Silver':
        return t('tierSilver');
      default:
        return t('tierBronze');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-800 text-sm tracking-wide">
              {t('passTitle')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Card Frame */}
          <div
            className={`relative rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br ${getTierGradient(
              tier
            )} border overflow-hidden`}
          >
            {/* Background patterns */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute right-12 top-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold tracking-wider uppercase text-emerald-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('appName')}</span>
                </div>
                <h3 className="text-xl font-extrabold mt-1 tracking-tight">{user.name}</h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">{user.phone}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center space-x-1 ${
                  tier === 'Platinum'
                    ? 'tier-badge-platinum'
                    : tier === 'Gold'
                    ? 'tier-badge-gold'
                    : tier === 'Silver'
                    ? 'tier-badge-silver'
                    : 'tier-badge-bronze'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{getTierLocalized(tier)}</span>
              </span>
            </div>

            {/* QR Code section */}
            <div className="my-5 flex flex-col items-center justify-center p-4 rounded-xl bg-white text-slate-900 shadow-inner">
              <QRCodeSVG
                value={user.memberCode || 'ETR-DEMO'}
                size={160}
                level="H"
                includeMargin={false}
              />
              <div className="mt-3 font-mono font-bold text-lg tracking-widest text-slate-800">
                {user.memberCode}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 text-center">
                {t('passPresentHint')}
              </p>
            </div>

            {/* Bottom balance stats */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <div>
                <p className="text-slate-400 uppercase text-[10px] tracking-wider">
                  {t('availableBalance')}
                </p>
                <p className="text-xl font-black text-amber-400">
                  {points.toLocaleString()} {t('pointsShort')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 uppercase text-[10px] tracking-wider">
                  {t('cashValue')}
                </p>
                <p className="text-xl font-bold text-emerald-400">
                  {etbValue} {t('currency')}
                </p>
              </div>
            </div>
          </div>

          {/* Tier Perk Indicator */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                <strong>{getTierLocalized(tier)} {t('tierPerk')}:</strong> {getTierMultiplier(tier)} {isAmharic ? 'የነጥብ ማባዣ' : 'Multiplier'}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('passActivePass')}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            {t('passFooterHint')}
          </p>
        </div>
      </div>
    </div>
  );
};
