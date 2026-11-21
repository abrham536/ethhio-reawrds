import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BlogPage = () => {
  const { isAmharic } = useAuth();
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: isAmharic ? 'የፒ ኤንድ ጂ (P&G) ምርቶች ዓለም አቀፍ ታሪክ እና ጥራት' : 'P&G Global Heritage & Quality Excellence',
      category: 'COMPANY',
      readTime: '3 min read',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop&q=80',
      summary: isAmharic
        ? 'ፒ ኤንድ ጂ ከ180 ዓመታት በላይ በዓለም ዙሪያ በሚሊዮኖች የሚቆጠሩ ሰዎችን ሕይወት የሚያቀሉ የታመኑ ምርቶችን ሲያቀርብ ቆይቷል።'
        : 'For over 180 years, Procter & Gamble has provided world-class brands like Ariel, Pampers, Always, and Braun.',
    },
    {
      id: 2,
      title: isAmharic ? 'በኢትዮጵያ በሞባይል ስልክ ተጨማሪ ገቢ የሚያገኙበት 5 መንገዶች' : '5 Smart Ways to Earn Digital Income in Ethiopia',
      category: 'FINANCE',
      readTime: '4 min read',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
      summary: isAmharic
        ? 'በቴሌብር እና በሞባይል ባንኪንግ አማካኝነት በየቀኑ አስተማማኝ ትርፍ የሚያስገኙ የኢንቨስትመንት መርሆዎች።'
        : 'Smart strategies to maximize daily cashback dividends and leverage community referral rewards.',
    },
    {
      id: 3,
      title: isAmharic ? 'የንግድ ባንክ እና የቴሌብር ክፍያዎችን ደህንነት ማስጠበቅ' : 'Securing Your Telebirr & CBE Withdrawals',
      category: 'SECURITY',
      readTime: '2 min read',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      summary: isAmharic
        ? 'የ6 አሃዝ የንግድ ምስጢር ቃል (Trade Password) አስፈላጊነት እና አካውንትዎን እንዴት መጠበቅ እንደሚችሉ።'
        : 'How our anti-fraud FT validation and 6-digit trade pin protect your funds round the clock.',
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
          {isAmharic ? 'ብሎግ እና መረጃ' : 'Blog'}
        </h1>

        <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400 flex items-center justify-center">
          <BookOpen className="w-4 h-4" />
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((art) => (
          <div
            key={art.id}
            className="rounded-3xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-lg group hover:border-emerald-500/40 transition-all"
          >
            <div className="relative h-40 overflow-hidden bg-slate-900">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                {art.category}
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold">{art.readTime}</span>
              <h3 className="text-xs sm:text-sm font-black text-white leading-snug group-hover:text-emerald-400 transition-colors">
                {art.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {art.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
