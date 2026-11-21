import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Calendar, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NoticePage = () => {
  const { isAmharic } = useAuth();
  const navigate = useNavigate();

  const notices = [
    {
      id: 1,
      title: isAmharic ? 'የዕለታዊ ትርፍ ክፍፍል ሰዓት ማስታወቂያ' : 'Daily VIP Return Settlement Notice',
      date: '2026-11-21',
      badge: 'VIP SYSTEM',
      content: isAmharic
        ? 'የሁሉም ቪአይፒ ምርቶች ዕለታዊ ገቢ በየቀኑ በኢትዮጵያ ሰዓት አቆጣጠር ከምሽቱ 12:00 ሰዓት ጀምሮ በቀጥታ ወደ ሚወጣው ሂሳብዎ ይገባል።'
        : 'Daily returns for all active VIP investments are settled automatically every day at 18:00 (EAT) directly into your Withdraw Balance.',
    },
    {
      id: 2,
      title: isAmharic ? 'የመጋበዣ ቦነስ እና የኮሚሽን ጭማሪ' : 'Invitation Bonus Increase Announcement',
      date: '2026-11-20',
      badge: 'PROMOTION',
      content: isAmharic
        ? 'ጓደኞችዎን በመጋበዣ ኮድዎ በማስመዝገብ ለእያንዳንዱ ንቁ አባል 50 ነፃ ነጥቦችን እና ተጨማሪ 10% የደረጃ ኮሚሽን ጉርሻ ማግኘት ይችላሉ።'
        : 'Invite friends using your unique referral code to earn instant 50 points and 10% multi-tier team dividends on every VIP activation.',
    },
    {
      id: 3,
      title: isAmharic ? 'የንግድ ባንክ (CBE) እና ቴሌብር ፈጣን ክፍያ' : 'Instant CBE & Telebirr Processing',
      date: '2026-11-19',
      badge: 'PAYMENT',
      content: isAmharic
        ? 'የማስገቢያ እና የማውጣት ጥያቄዎች ያለ ምንም መዘግየት በ 15 ደቂቃዎች ውስጥ በአስተዳዳሪው ተረጋግጠው ይላካሉ።'
        : 'All deposit orders via CBE FT/v2- verification and Telebirr payouts are reviewed and completed within 15 minutes by admin.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 pb-28 pt-3 px-3 sm:px-5 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-black tracking-wide text-white">
          {isAmharic ? 'ማስታወቂያዎች' : 'Notice'}
        </h1>

        <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400 flex items-center justify-center">
          <Bell className="w-4 h-4" />
        </div>
      </div>

      {/* Notice List */}
      <div className="space-y-3.5">
        {notices.map((n) => (
          <div
            key={n.id}
            className="rounded-3xl bg-[#0f172a] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {n.badge}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{n.date}</span>
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-black text-white">
              {n.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {n.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
