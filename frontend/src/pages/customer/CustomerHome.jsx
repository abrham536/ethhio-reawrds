import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Headphones,
  ChevronRight,
  Copy,
  Gift,
  Users,
  Gem,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const CustomerHome = () => {
  const { user, isAmharic, t, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [copiedInvite, setCopiedInvite] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null);

  // Live dividend feed ticker
  const [tickerIndex, setTickerIndex] = useState(0);
  const dividendFeed = [
    { phone: '0912***45', amount: 'Br 417.40', product: 'Pampers VIP 1' },
    { phone: '0924***89', amount: 'Br 2,640.00', product: 'Ariel VIP 2' },
    { phone: '0933***12', amount: 'Br 14,700.00', product: 'Always VIP 3' },
    { phone: '0945***78', amount: 'Br 417.40', product: 'Pampers VIP 1' },
    { phone: '0911***90', amount: 'Br 60,000.00', product: 'HEGII VIP 5' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % dividendFeed.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/register?invitation_code=${user?.referralCode || 'ETHIOREWARDS'}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopiedInvite(false), 2500);
  };

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

  const displayName = user?.name || (user?.phone ? user.phone.slice(-4) : 'Guest');

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 pb-28 pt-3 px-3 sm:px-5 max-w-lg mx-auto">
      {/* Top Header matching Screenshot 1 */}
      <div className="flex items-center justify-between py-2 mb-3">
        <div className="flex items-center space-x-2.5">
          {/* Green P&G logo badge */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center font-black text-white text-xs shadow-md shadow-emerald-500/30">
            P&G
          </div>
          <div>
            <h2 className="text-sm font-black text-white leading-tight">
              Hi, {displayName}
            </h2>
            <p className="text-[10px] text-emerald-400 font-bold">
              Welcome To P&G
            </p>
          </div>
        </div>

        {/* Support Button */}
        <button
          onClick={() => alert(isAmharic ? 'የደንበኞች ድጋፍ አገልግሎት፡ Telegram @EthioRewardsSupport' : 'Support: Telegram @EthioRewardsSupport')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 font-bold text-xs hover:bg-slate-800 active:scale-95 transition-all shadow-md shadow-emerald-950/40"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Support</span>
        </button>
      </div>

      {/* Checkin Status Banner */}
      {checkInStatus && (
        <div
          className={`mb-3 p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in ${
            checkInStatus.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}
        >
          <span>{checkInStatus.type === 'success' ? '💎' : 'ℹ️'}</span>
          <span>{checkInStatus.message}</span>
        </div>
      )}

      {/* Hero Card: "Invite friends, earn rewards" matching Screenshot 1 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d3326] via-[#0b241d] to-[#0a1a1b] border border-emerald-500/30 p-5 mb-4 shadow-xl shadow-emerald-950/40">
        <div className="relative z-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight max-w-[200px]">
            {isAmharic ? 'ጓደኞችዎን ይጋብዙ፣ ሽልማቶችን ያግኙ' : 'Invite friends, earn rewards'}
          </h2>

          <button
            onClick={handleCopyInvite}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-emerald-800 font-black text-xs shadow-md shadow-white/10 flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <span>{copiedInvite ? (isAmharic ? 'ኮፒ ተደርጓል!' : 'Copied!') : (isAmharic ? 'አሁን ይጋብዙ >' : 'Invite now >')}</span>
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* P&G Trusted Worldwide Promotional Card matching Screenshot 1 */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-sky-950/80 border border-slate-800 p-4 mb-4 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="w-12 h-6 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-[10px] shadow-sm">
            P&G
          </div>
          <span className="text-xs font-black tracking-wide text-white/90">
            Trusted Worldwide
          </span>
        </div>

        <div className="flex items-center justify-around py-2 opacity-90">
          <span className="text-xs font-black text-blue-200">Ariel</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-black text-emerald-300">Pampers</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-black text-pink-300">Always</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-black text-amber-300">Braun</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-black text-sky-300">Crest</span>
        </div>
      </div>

      {/* 4 Quick Action Circles matching Screenshot 1 */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-4 shadow-lg mb-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Recharge (Pink/Purple) */}
          <Link
            to="/finance?tab=deposit"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition-transform">
              👛
            </div>
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              {isAmharic ? 'መሙያ' : 'Recharge'}
            </span>
          </Link>

          {/* Withdraw (Blue) */}
          <Link
            to="/withdraw"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition-transform">
              🪙
            </div>
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              {isAmharic ? 'ማውጫ' : 'Withdraw'}
            </span>
          </Link>

          {/* Team (Blue with users icon) */}
          <Link
            to="/account"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-base shadow-md group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              {isAmharic ? 'ቡድን' : 'Team'}
            </span>
          </Link>

          {/* VIP (Gold Crown) */}
          <Link
            to="/invest"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-base shadow-md group-hover:scale-105 transition-transform">
              <Gem className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              VIP
            </span>
          </Link>
        </div>
      </div>

      {/* Live Dividend Payout Ticker */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 px-4 py-2.5 mb-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400 text-[11px]">
            {dividendFeed[tickerIndex].phone} received {dividendFeed[tickerIndex].amount}
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-400">
          {dividendFeed[tickerIndex].product}
        </span>
      </div>

      {/* Section | Activity Center matching Screenshot 1 */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 px-1">
          <div className="w-1.5 h-4 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
          <span className="text-xs font-black tracking-wider uppercase text-slate-200">
            {isAmharic ? 'የተግባር ማዕከል' : 'Activity Center'}
          </span>
        </div>

        {/* Card 1: Invite link with COPY button */}
        <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl shadow-md">
              👥
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white">
                {isAmharic ? 'የመጋበዣ ሊንክ' : 'Invite link'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {isAmharic ? 'የማነቃቂያ ሽልማት ' : 'Activation reward '}
                <span className="text-emerald-400 font-black">Br170</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyInvite}
            className="px-3.5 py-1.5 rounded-full border border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-black text-xs active:scale-95 transition-all"
          >
            {copiedInvite ? (isAmharic ? 'ኮፒ ሆኗል!' : 'COPIED') : 'COPY'}
          </button>
        </div>

        {/* Card 2: Lucky wheel with chevron */}
        <Link
          to="/account"
          className="rounded-3xl bg-[#0f172a] border border-slate-800 p-4 flex items-center justify-between shadow-lg hover:border-amber-500/40 transition-all block"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl shadow-md">
              🎁
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white">
                {isAmharic ? 'የዕድል እሽክርክሪት' : 'Lucky wheel'}
              </h3>
              <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                {isAmharic ? '100% የማሸነፍ ዕድል' : '100% win rate'}
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-500" />
        </Link>

        {/* Card 3: Daily check-in */}
        <button
          onClick={handleDailyCheckIn}
          disabled={checkInLoading}
          className="w-full rounded-3xl bg-[#0f172a] border border-slate-800 p-4 flex items-center justify-between shadow-lg hover:border-emerald-500/40 transition-all text-left"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xl shadow-md">
              📅
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white">
                {isAmharic ? 'የዕለት ጉርሻ' : 'Daily Check-in'}
              </h3>
              <p className="text-[11px] text-blue-400 font-semibold mt-0.5">
                +10 {t('pointsShort')} (1.00 ETB)
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
            {checkInLoading ? '...' : (isAmharic ? 'ውሰድ' : 'Claim')}
          </span>
        </button>
      </div>
    </div>
  );
};
