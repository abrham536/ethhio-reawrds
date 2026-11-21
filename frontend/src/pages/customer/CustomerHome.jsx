import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  QrCode,
  ArrowRight,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Share2,
  Wallet,
  CheckCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DigitalCardModal } from '../../components/DigitalCardModal';

export const CustomerHome = () => {
  const { user, isAmharic, t } = useAuth();
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const points = user?.pointsBalance || 0;
  const etbValue = (points * 0.1).toFixed(2);
  const walletCash = user?.walletBalanceETB || 0;
  const totalBalance = walletCash + Number(etbValue);
  const tier = user?.tier || 'Bronze';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Hero Banner - Mobile Friendly */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('heroTagline')}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {isAmharic ? (
                  <>
                    ገንዘብ ያስገቡ፣ <span className="text-amber-400">ትርፍ ያግኙ</span>፣ በማንኛውም ጊዜ ያውጡ!
                  </>
                ) : (
                  <>
                    Deposit, <span className="text-amber-400">Earn Profit</span> & Cashout Anytime!
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {isAmharic
                  ? 'በቴሌብር ወይም በባንክ ገንዘብ ያስገቡ፣ በግዢዎችዎ ላይ ተመላሽ ገንዘብ እና ነጥብ ይሰብስቡ፣ ያገኙትን ትርፍ ደግሞ በአስተዳዳሪው ማረጋገጫ በቀላሉ ያውጡ።'
                  : 'Deposit via Telebirr or Bank, collect instant cashback and rewards on purchases, and withdraw your profits securely with admin verification.'}
              </p>

              {/* Action Buttons for Mobile & Desktop */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <Link
                  to="/finance"
                  className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>{t('tabDeposit')}</span>
                </Link>

                <Link
                  to="/finance"
                  className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{t('tabWithdraw')}</span>
                </Link>

                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-xs transition-all"
                >
                  <QrCode className="w-4 h-4 text-amber-300" />
                  <span>{t('btnShowPass')}</span>
                </button>
              </div>
            </div>

            {/* Right: Balance Card Widget */}
            <div className="w-full lg:max-w-md rounded-3xl p-5 sm:p-6 bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                    {t('totalBalance')}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
                    {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                    <span className="text-xs text-white font-bold">{t('currency')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                    {tier}
                  </span>
                  <p className="text-[10px] text-slate-300 mt-1 font-mono">
                    {user?.memberCode || 'ETR-MEMBER'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-slate-300 block uppercase font-semibold">
                    {t('walletCash')}
                  </span>
                  <span className="text-base font-black text-white">
                    {walletCash.toLocaleString()} {t('currency')}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                  <span className="text-[10px] text-slate-300 block uppercase font-semibold">
                    {t('points')}
                  </span>
                  <span className="text-base font-black text-emerald-300">
                    {points.toLocaleString()} {t('pointsShort')}
                  </span>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>{t('nextTierGoal')}</span>
                  <span className="font-bold text-amber-300">
                    {tier === 'Platinum' ? t('topTierReached') : 'Gold (4,000 Pts)'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((points / 4000) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 space-y-8 relative z-20">
        {/* 4 Core Platform Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Deposit */}
          <Link
            to="/finance"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-slate-900 mb-1">
                {t('tabDeposit')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAmharic
                  ? 'በቴሌብር ወይም በባንክ ገንዘብ ያስገቡ፤ ስክሪንሹት ደረሰኝ ሲያያይዙ አስተዳዳሪው አረጋግጦ ወዲያው ገቢ ያደርጋል።'
                  : 'Deposit funds via Telebirr or Bank. Upload receipt screenshot for instant admin verification.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>{isAmharic ? 'ገንዘብ አስገባ' : 'Deposit Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Withdraw */}
          <Link
            to="/finance"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-slate-900 mb-1">
                {t('tabWithdraw')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAmharic
                  ? 'ያገኙትን ትርፍ እና ተመላሽ ገንዘብ በቀጥታ ወደ ቴሌብር ወይም የባንክ ሂሳብዎ በአስተዳዳሪው ፍቃድ ያውጡ።'
                  : 'Withdraw your profits and cashback directly to Telebirr or Bank account with admin approval.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>{isAmharic ? 'ትርፍ አውጣ' : 'Withdraw Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: Redeem Points */}
          <Link
            to="/redeem"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-slate-900 mb-1">
                {t('navRedeem')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAmharic
                  ? 'ነጥቦችዎን ወደ ቴሌብር ጥሬ ገንዘብ፣ ለስልክ ካርድ (ኤርታይም) ወይም ለቅናሽ ቫውቸሮች ይለውጡ።'
                  : 'Convert loyalty points to Telebirr cash, mobile airtime, or store discount vouchers.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>{isAmharic ? 'ነጥብ ቀይር' : 'Redeem Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Referrals */}
          <Link
            to="/referrals"
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-slate-900 mb-1">
                {t('navReferrals')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAmharic
                  ? 'የመጋበዣ ኮድዎን ለወዳጅዎ ያካፍሉ። ሲመዘገቡ 100 ነጥብ ያገኛሉ፣ እርስዎም 50 ነጥብ ወዲያው ይሸለማሉ!'
                  : 'Invite friends using your code. They receive 100 welcome points, and you earn 50 instant bonus points!'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>{isAmharic ? 'ጋብዘው ያትርፉ' : 'Invite Friends'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Simple 3-Step Process Guide */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
              {isAmharic ? 'ቀላል አሰራር' : 'Simple 3-Step Process'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {isAmharic
                ? 'ገንዘብ እንዴት እንደሚያስገቡ እና እንደሚያወጡ'
                : 'How Money Deposits & Withdrawals Work'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg mb-3 shadow-xs">
                1
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {isAmharic ? 'ገንዘብ ያስተላልፉና ደረሰኝ ይላኩ' : 'Transfer & Attach Receipt'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAmharic
                  ? 'በይፋዊ የቴሌብር ወይም የባንክ አካውንታችን ገንዘብ ልከው የደረሰኝ ስክሪንሹት እና Txn ID በፎርሙ በኩል ያስገባሉ።'
                  : 'Transfer to official platform accounts and upload the payment confirmation screenshot.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg mb-3 shadow-xs">
                2
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {isAmharic ? 'አስተዳዳሪው ያረጋግጣል' : 'Admin Verifies & Credits'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAmharic
                  ? 'አስተዳዳሪው ደረሰኙን ፈትሾ ሲያጸድቅ ገንዘቡ ወዲያው ወደ ቦርሳዎ ይገባል፤ በግዢዎችዎም ትርፍ እና ነጥብ ያገኛሉ።'
                  : 'Admin inspects the receipt screenshot and approves it. Your wallet is credited instantly.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg mb-3 shadow-xs">
                3
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {isAmharic ? 'ትርፍዎን በቀላሉ ያውጡ' : 'Withdraw Your Profit'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAmharic
                  ? 'ያገኙትን ትርፍ በማንኛውም ሰዓት ወደ ቴሌብር ወይም የባንክ ሂሳብዎ በአስተዳዳሪው ማረጋገጫ ማውጣት ይችላሉ።'
                  : 'Request a payout of your balance anytime directly to your Telebirr or Bank account.'}
              </p>
            </div>
          </div>
        </section>

        {/* Security & Anti-Fraud Notice Banner */}
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-emerald-950">
                {isAmharic ? '100% የተጠበቀ እና በአስተዳዳሪ ቁጥጥር ስር ያለ ስርዓት' : '100% Secure & Admin-Controlled Platform'}
              </h4>
              <p className="text-[11px] text-emerald-800">
                {isAmharic
                  ? 'ሁሉም የገንዘብ ማስገቢያዎች እና ማውጣቶች በአስተዳዳሪው በእጅ እየተመረመሩ ይረጋገጣሉ።'
                  : 'Every deposit and withdrawal is manually verified against verified payment statements.'}
              </p>
            </div>
          </div>

          <Link
            to="/finance"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 transition-colors"
          >
            {isAmharic ? 'ወደ ገንዘብ ማዕከል ይሂዱ' : 'Open Finance Center'}
          </Link>
        </div>
      </main>

      {/* Digital QR Card Modal */}
      <DigitalCardModal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} />
    </div>
  );
};