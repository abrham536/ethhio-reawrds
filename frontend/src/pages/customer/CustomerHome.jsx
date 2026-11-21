import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  QrCode,
  ArrowRight,
  Gift,
  ShoppingBag,
  Coffee,
  Fuel,
  Laptop,
  HeartPulse,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  CheckCircle2,
  X,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { MerchantCard } from '../../components/MerchantCard';
import { DigitalCardModal } from '../../components/DigitalCardModal';

export const CustomerHome = () => {
  const { user, isAmharic, t } = useAuth();
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const CATEGORIES = [
    { id: 'All', name: t('catAll'), icon: ShoppingBag },
    { id: 'Cafe & Restaurant', name: t('catCafes'), icon: Coffee },
    { id: 'Supermarket', name: t('catSupermarkets'), icon: ShoppingBag },
    { id: 'Fuel Station', name: t('catFuel'), icon: Fuel },
    { id: 'Electronics', name: t('catElectronics'), icon: Laptop },
    { id: 'Health & Pharmacy', name: t('catHealth'), icon: HeartPulse },
  ];

  useEffect(() => {
    fetchMerchants();
  }, [selectedCategory, searchQuery]);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/merchants', { params });
      if (res.data.success) {
        setMerchants(res.data.merchants);
      }
    } catch (err) {
      console.error('Error fetching merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  const points = user?.pointsBalance || 0;
  const etbValue = (points * 0.1).toFixed(2);
  const tier = user?.tier || 'Bronze';

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Greeting & Headline */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-4 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('heroTagline')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {t('heroTitlePrefix')}
                <span className="text-amber-400">{t('heroTitleHighlight')}</span>
                {t('heroTitleSuffix')}
              </h1>

              <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                {t('heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{t('btnShowPass')}</span>
                </button>

                <a
                  href="#merchants"
                  className="flex items-center space-x-1.5 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all"
                >
                  <span>{t('btnExplorePartners')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Dynamic Wallet & Card Snapshot */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                      {t('walletSnapshotTitle')}
                    </span>
                    <h3 className="text-3xl font-black text-amber-300 mt-0.5">
                      {points.toLocaleString()} <span className="text-sm font-bold text-white">{t('pointsShort')}</span>
                    </h3>
                    <p className="text-xs text-emerald-300 font-medium">
                      ≈ {etbValue} {t('currency')} {t('cashValue')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                      {tier} {t('tierLevel')}
                    </span>
                    <p className="text-[11px] text-slate-300 mt-1 font-mono">
                      {user?.memberCode || 'ETR-DEMO'}
                    </p>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold">
                  <button
                    onClick={() => setIsPassModalOpen(true)}
                    className="p-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/10 flex items-center justify-center space-x-2 transition-all"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span>{t('btnShowPass')}</span>
                  </button>
                  <a
                    href="/redeem"
                    className="p-3 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white flex items-center justify-center space-x-2 transition-all"
                  >
                    <Gift className="w-4 h-4 text-white" />
                    <span>{t('navRedeem')}</span>
                  </a>
                </div>

                {/* Progress bar to next tier */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                    <span>{t('nextTierGoal')}</span>
                    <span className="font-bold text-amber-300">
                      {tier === 'Platinum'
                        ? t('topTierReached')
                        : tier === 'Gold'
                        ? `Platinum (10,000 ${t('pointsShort')})`
                        : `Gold (4,000 ${t('pointsShort')})`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((points / 10000) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="merchants" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search and Filters Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-slate-500 font-semibold shrink-0">
              {t('showingStores')}:{' '}
              <span className="text-slate-900 font-bold">{merchants.length}</span>{' '}
              {t('verifiedStores')}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Merchants Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {t('featuredPartners')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('featuredSubtitle')}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-slate-200/70" />
              ))}
            </div>
          ) : merchants.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                {t('noMerchantsFound')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {t('noMerchantsHint')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchants.map((merchant) => (
                <MerchantCard
                  key={merchant._id}
                  merchant={merchant}
                  onSelect={(m) => setSelectedMerchant(m)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3-Step "How It Works" Section */}
        <section className="mt-16 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {t('howItWorks')}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {t('howItWorksSubtitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl mb-4 shadow-xs">
                1
              </div>
              <h4 className="font-bold text-base text-slate-900">
                {t('step1Title')}
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl mb-4 shadow-xs">
                2
              </div>
              <h4 className="font-bold text-base text-slate-900">
                {t('step2Title')}
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl mb-4 shadow-xs">
                3
              </div>
              <h4 className="font-bold text-base text-slate-900">
                {t('step3Title')}
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Selected Merchant Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="relative h-48 w-full">
              <img
                src={selectedMerchant.coverImage}
                alt={selectedMerchant.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedMerchant(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-md">
                {selectedMerchant.cashbackRate}% {isAmharic ? 'ተመላሽ' : 'Cashback'}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={selectedMerchant.logo}
                  alt={selectedMerchant.name}
                  className="w-12 h-12 rounded-xl object-cover border"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                    {isAmharic && selectedMerchant.tradeNameAmharic
                      ? selectedMerchant.tradeNameAmharic
                      : selectedMerchant.name}
                  </h3>
                  {selectedMerchant.tradeNameAmharic && (
                    <p className="text-xs text-slate-500">
                      {isAmharic ? selectedMerchant.name : selectedMerchant.tradeNameAmharic}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {selectedMerchant.description}
              </p>

              {/* Deal banner */}
              {selectedMerchant.featuredDeal?.title && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 mb-4 text-xs">
                  <span className="font-bold text-amber-900 block">
                    🎁 {selectedMerchant.featuredDeal.title}
                  </span>
                  <span className="text-amber-700 block text-[11px] mt-0.5">
                    {selectedMerchant.featuredDeal.description}
                  </span>
                </div>
              )}

              {/* Location & Details */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{selectedMerchant.address}, {selectedMerchant.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedMerchant.phone}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedMerchant(null);
                  setIsPassModalOpen(true);
                }}
                className="mt-6 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>{t('btnShowPass')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Loyalty Pass Modal */}
      <DigitalCardModal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} />
    </div>
  );
};
