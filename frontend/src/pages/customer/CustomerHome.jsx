import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  QrCode,
  Share2,
  Calendar,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle,
  Copy,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { DigitalCardModal } from '../../components/DigitalCardModal';
import api from '../../api/client';

export const CustomerHome = () => {
  const { user, isAmharic, t, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const points = user?.pointsBalance || 0;
  const etbValue = Number((points * 0.1).toFixed(2));
  const walletCash = user?.walletBalanceETB || 0;
  const totalBalance = walletCash + etbValue;

  // Clean phone display e.g. 963699674
  const displayPhone = user?.phone
    ? user.phone.replace('+251', '').replace(/^0/, '')
    : '963699674';

  const handleDailyCheckIn = async () => {
    try {
      setCheckInLoading(true);
      const res = await api.post('/auth/daily-checkin');
      if (res.data?.success) {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        setCheckInStatus({
          type: 'success',
          message: isAmharic
            ? '🎉 እንኳን ደስ አለዎት! የ 10 ነፃ ነጥቦች (1.00 ብር) የዕለት ጉርሻ ተቀብለዋል!'
            : '🎉 Daily Check-in Success! Earned +10 Points (1.00 ETB)!',
        });
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      setCheckInStatus({
        type: 'info',
        message:
          err.response?.data?.message ||
          (isAmharic
            ? 'ቀደም ሲል ለዛሬ የዕለት ጉርሻዎን ወስደዋል! ነገ ተመልሰው ይሞክሩ።'
            : 'You have already checked in today! Come back tomorrow.'),
      });
    } finally {
      setCheckInLoading(false);
      setTimeout(() => setCheckInStatus(null), 4000);
    }
  };

  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/register?invitation_code=${user?.referralCode || 'ETHIOREWARDS'}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-28 pt-4 px-3 sm:px-6 max-w-lg mx-auto">
      {/* Top Greeting matching Image 2 */}
      <div className="mb-4 px-2 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-semibold leading-none">
            {isAmharic ? 'ሰላም፣' : 'Hello,'}
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 font-mono">
            {displayPhone}
          </h2>
          <p className="text-[11px] text-slate-400 font-medium">
            {isAmharic ? 'እንኳን ደህና መጡ!' : 'Welcome!'}
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-xl">
          🎁
        </div>
      </div>

      {/* Checkin Alert Banner */}
      {checkInStatus && (
        <div
          className={`mb-4 p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-sm ${
            checkInStatus.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-100 text-amber-900 border border-amber-200'
          }`}
        >
          <span>{checkInStatus.type === 'success' ? '💎' : 'ℹ️'}</span>
          <span>{checkInStatus.message}</span>
        </div>
      )}

      {/* Emerald Green Balance Card matching Image 2 */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-700/25 mb-6">
        {/* Subtle wavy chart background line */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,160 Q 100,120 200,140 T 400,90 L 400,200 L 0,200 Z"
            fill="white"
          />
          <path
            d="M 0,160 Q 100,120 200,140 T 400,90"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
        </svg>

        <div className="relative z-10 space-y-4">
          {/* Header row with ETB badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-emerald-100/90 tracking-wider">
              {isAmharic ? 'አጠቃላይ ሂሳብ' : 'Total balance'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white border border-white/20">
              ETB
            </span>
          </div>

          {/* Large Balance Display */}
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ETB {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-emerald-200 font-semibold mt-1 flex items-center space-x-1.5">
              <span>{isAmharic ? 'የዛሬ ትርፍ' : 'Total income'}</span>
              <span className="font-bold text-amber-300">
                + ETB {(etbValue > 0 ? etbValue : 0).toFixed(2)}
              </span>
            </p>
          </div>

          {/* Two Pill Action Buttons: top up (Yellow) & Withdraw (Green) */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <Link
              to="/finance?tab=deposit"
              className="py-3 px-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-400/30 flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
            >
              <span className="text-base">👛</span>
              <span>{isAmharic ? 'ገንዘብ አስገባ' : 'top up'}</span>
            </Link>

            <Link
              to="/finance?tab=withdraw"
              className="py-3 px-4 rounded-full bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-bold text-xs sm:text-sm border border-emerald-400/30 shadow-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
            >
              <span className="text-base">🪙</span>
              <span>{isAmharic ? 'ገንዘብ አውጣ' : 'Withdraw'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2x2 Grid of 3D Feature Cards matching Image 2 */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        {/* Card 1: Daily check-in */}
        <button
          onClick={handleDailyCheckIn}
          disabled={checkInLoading}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col items-center text-center group active:scale-95"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl mb-2.5 group-hover:scale-105 transition-transform">
            📅
          </div>
          <h3 className="font-black text-xs sm:text-sm text-slate-900">
            {isAmharic ? 'ዕለታዊ ጉርሻ' : 'Daily check-in'}
          </h3>
          <span className="text-[10px] text-amber-600 font-bold mt-0.5">
            +10 {t('pointsShort')} (1.00 ETB)
          </span>
        </button>

        {/* Card 2: Products */}
        <Link
          to="/redeem"
          className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col items-center text-center group active:scale-95"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-3xl mb-2.5 group-hover:scale-105 transition-transform">
            💰
          </div>
          <h3 className="font-black text-xs sm:text-sm text-slate-900">
            {isAmharic ? 'ምርቶች እና ቫውቸር' : 'Products'}
          </h3>
          <span className="text-[10px] text-purple-600 font-bold mt-0.5">
            {isAmharic ? 'ነጥብ መለወጫ' : 'Earn Rewards'}
          </span>
        </Link>

        {/* Card 3: My account */}
        <button
          onClick={() => setIsPassModalOpen(true)}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center group active:scale-95"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl mb-2.5 group-hover:scale-105 transition-transform">
            👑
          </div>
          <h3 className="font-black text-xs sm:text-sm text-slate-900">
            {isAmharic ? 'የእኔ አካውንት' : 'My account'}
          </h3>
          <span className="text-[10px] text-indigo-600 font-bold mt-0.5">
            {user?.tier || 'Bronze'} Member
          </span>
        </button>

        {/* Card 4: Invite / Download */}
        <button
          onClick={handleCopyInvite}
          className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-center text-center group active:scale-95"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl mb-2.5 group-hover:scale-105 transition-transform">
            ☁️
          </div>
          <h3 className="font-black text-xs sm:text-sm text-slate-900">
            {copiedInvite
              ? (isAmharic ? 'ኮፒ ተደርጓል!' : 'Copied!')
              : (isAmharic ? 'ጋብዘው ያትርፉ' : 'Invite & Earn')}
          </h3>
          <span className="text-[10px] text-blue-600 font-bold mt-0.5">
            +50 {t('pointsShort')} Bonus
          </span>
        </button>
      </div>

      {/* Information Banner matching bottom of Image 2 */}
      <div className="rounded-3xl bg-slate-900 text-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-amber-400">
            {isAmharic ? 'ስለ ኢትዮ ሪዋርድስ መረጃ፦' : 'Information about:'}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
            100% Verified
          </span>
        </div>

        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-center space-x-2">
            <span>💰</span>
            <span>{isAmharic ? 'በኢትዮጵያ በቴሌብር እና በባንክ ገንዘብ ማግኘት' : 'Make Money Online in Ethiopia'}</span>
          </li>
          <li className="flex items-center space-x-2">
            <span>📱</span>
            <span>{isAmharic ? 'በስልክዎ ገንዘብ የሚያገኙበት ፈጣን መንገድ' : 'Ways to Earn Money Using Your Phone'}</span>
          </li>
          <li className="flex items-center space-x-2">
            <span>🏦</span>
            <span>{isAmharic ? 'ቀጥታ ወደ ቴሌብር እና ንግድ ባንክ ፈጣን ወጪ' : 'Instant Telebirr & CBE Birr Withdrawals'}</span>
          </li>
          <li className="flex items-center space-x-2">
            <span>🛡️</span>
            <span>{isAmharic ? 'በአስተዳዳሪ የተረጋገጠ እና የታመነ መድረክ' : 'Safe, Verified & Admin-Controlled Platform'}</span>
          </li>
        </ul>

        <div className="pt-2 border-t border-slate-800">
          <Link
            to="/finance"
            className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <span>{isAmharic ? 'ወደ ገንዘብ ማስገቢያ/ማውጫ ይሂዱ' : 'Go to Deposit & Withdraw'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Loyalty QR Modal */}
      <DigitalCardModal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} />
    </div>
  );
};