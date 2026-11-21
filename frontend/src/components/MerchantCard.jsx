import React from 'react';
import { MapPin, Phone, Sparkles, Tag, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MerchantCard = ({ merchant, onSelect }) => {
  const { isAmharic, t } = useAuth();

  return (
    <div
      onClick={() => onSelect && onSelect(merchant)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {/* Top Banner Image with Cashback Badge */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={merchant.coverImage}
          alt={merchant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

        {/* Cashback Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black shadow-md border border-emerald-400/30 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>
            {merchant.cashbackRate}% {isAmharic ? 'ተመላሽ' : 'Cashback'}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
          {merchant.category}
        </div>

        {/* Merchant Logo & Name on Cover */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2.5">
          <img
            src={merchant.logo}
            alt={merchant.name}
            className="w-10 h-10 rounded-xl object-cover border-2 border-white bg-white shadow-md"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150';
            }}
          />
          <div className="text-white overflow-hidden">
            <h4 className="font-bold text-sm leading-tight truncate">
              {isAmharic && merchant.tradeNameAmharic ? merchant.tradeNameAmharic : merchant.name}
            </h4>
            {merchant.tradeNameAmharic && !isAmharic && (
              <p className="text-[11px] text-emerald-200/90 truncate">
                {merchant.tradeNameAmharic}
              </p>
            )}
            {isAmharic && (
              <p className="text-[10px] text-emerald-200/90 truncate">
                {merchant.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {merchant.description || 'Visit store and earn points on every purchase.'}
        </p>

        {/* Featured Deal Callout if available */}
        {merchant.featuredDeal?.title && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start space-x-2">
            <Tag className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-[11px]">
              <span className="font-bold text-amber-900 block leading-tight">
                {merchant.featuredDeal.title}
              </span>
              <span className="text-amber-700 block text-[10px] mt-0.5">
                {merchant.featuredDeal.description}
              </span>
            </div>
          </div>
        )}

        {/* Footer address & action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1 truncate max-w-[70%]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{merchant.address}</span>
          </div>
          <span className="text-emerald-600 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
            <span>{t('details')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
