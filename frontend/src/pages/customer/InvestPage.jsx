import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Headphones,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const InvestPage = () => {
  const { user, isAmharic, t, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bestseller');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investingId, setInvestingId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [notice, setNotice] = useState(null);

  // Insufficient balance modal state
  const [rechargeModal, setRechargeModal] = useState({
    isOpen: false,
    shortage: 0,
    requiredPrice: 0,
    productName: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/invest/products?category=${activeTab}`);
      if (res.data?.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (product) => {
    try {
      setInvestingId(product.id);
      const res = await api.post('/invest/buy', { productId: product.id });
      if (res.data?.success) {
        confetti({ particleCount: 90, spread: 90, origin: { y: 0.5 } });
        setNotice({
          type: 'success',
          message: res.data.message || (isAmharic ? '🎉 በተሳካ ሁኔታ ኢንቨስት አድርገዋል!' : '🎉 Successfully invested!'),
        });
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.insufficientBalance) {
        setRechargeModal({
          isOpen: true,
          shortage: data.shortage || 0,
          requiredPrice: product.price,
          productName: product.name,
        });
      } else {
        setNotice({
          type: 'error',
          message: data?.message || (isAmharic ? 'ኢንቨስትመንቱ አልተሳካም። እባክዎ እንደገና ይሞክሩ።' : 'Investment failed. Please try again.'),
        });
      }
    } finally {
      setInvestingId(null);
      setTimeout(() => setNotice(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 pb-28 pt-3 px-3 sm:px-5 max-w-lg mx-auto">
      {/* Top Header Bar matching Screenshot */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-black tracking-wide text-white">
          {isAmharic ? 'ኢንቨስትመንት' : 'Investment'}
        </h1>

        <button
          onClick={() => alert(isAmharic ? 'የደንበኞች ድጋፍ አገልግሎት፡ Telegram @EthioRewardsSupport' : 'Customer Support: Telegram @EthioRewardsSupport')}
          className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
          title="Support"
        >
          <Headphones className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Row: [ Bestseller ] [ Discount ] [ Promotion (Hot) ] */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 mb-4">
        <button
          onClick={() => setActiveTab('bestseller')}
          className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'bestseller'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isAmharic ? 'ተወዳጅ' : 'Bestseller'}
        </button>

        <button
          onClick={() => setActiveTab('discount')}
          className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'discount'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isAmharic ? 'ቅናሽ' : 'Discount'}
        </button>

        <button
          onClick={() => setActiveTab('promotion')}
          className={`relative py-2 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'promotion'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>{isAmharic ? 'ማስተዋወቂያ' : 'Promotion'}</span>
          <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase scale-90 shadow-sm animate-pulse">
            Hot
          </span>
        </button>
      </div>

      {/* Alert toast */}
      {notice && (
        <div
          className={`mb-4 p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in ${
            notice.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Section Header: | ALL PRODUCTS */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-4 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
          <span className="text-xs font-black tracking-wider uppercase text-slate-200">
            {isAmharic ? 'ሁሉም ምርቶች' : 'ALL PRODUCTS'}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs ${
              viewMode === 'list' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs ${
              viewMode === 'grid' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">{isAmharic ? 'ምርቶች በመጫን ላይ...' : 'Loading products...'}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          {isAmharic ? 'ምንም ምርት አልተገኘም' : 'No products found'}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-4'}>
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-lg hover:border-emerald-500/50 transition-all group"
            >
              {/* Product Banner/Image with badges */}
              <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/40" />

                {/* Left Badge: VIP0 / Discount */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  {product.badge}
                </div>

                {/* Right Badge: 49 DAYS */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider shadow-md">
                  {product.days} {isAmharic ? 'ቀናት' : 'DAYS'}
                </div>

                {/* Product Tagline banner over image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {product.brand}
                  </span>
                  <h3 className="text-sm font-black text-white drop-shadow-md">
                    {product.name}
                  </h3>
                </div>
              </div>

              {/* Card Details Body */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    {isAmharic
                      ? `ይግዙና ወደ VIP ${product.vipTarget} ደረጃ ያሳድጉ`
                      : `Buy it to upgrade to VIP${product.vipTarget}`}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    VIP {product.vipTarget}
                  </span>
                </div>

                {/* 2x2 Stats Grid matching Screenshot */}
                <div className="grid grid-cols-2 gap-3 py-1 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                      PRICE
                    </span>
                    <span className="text-base sm:text-lg font-black text-amber-400">
                      Br{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                      DAILY EARNINGS
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-400">
                      Br{product.dailyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                      DAYS
                    </span>
                    <span className="text-base sm:text-lg font-black text-white">
                      {product.days}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                      TOTAL INCOME
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-400">
                      Br{product.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Invest Now Glowing Green Pill Button */}
                <button
                  onClick={() => handleInvest(product)}
                  disabled={investingId === product.id}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 active:scale-98 transition-all disabled:opacity-60"
                >
                  {investingId === product.id ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{isAmharic ? 'አሁን ኢንቨስት ያድርጉ' : 'Invest now'}</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insufficient Balance / Prompt Recharge Modal */}
      {rechargeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              💰
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {isAmharic ? 'የሂሳብ መጠን ማነስ' : 'Insufficient Balance'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {isAmharic
                  ? `የ${rechargeModal.productName} ዋጋ Br${rechargeModal.requiredPrice.toLocaleString()} ነው። እባክዎ ኢንቨስት ለማድረግ መጀመሪያ ሂሳብዎን ይሙሉ!`
                  : `Price is Br${rechargeModal.requiredPrice.toLocaleString()}. Please recharge your wallet balance to invest!`}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex justify-between font-bold">
              <span className="text-slate-400">{isAmharic ? 'የጎደለው መጠን' : 'Shortage'}</span>
              <span className="text-amber-400">Br{rechargeModal.shortage.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setRechargeModal({ isOpen: false, shortage: 0, requiredPrice: 0, productName: '' })}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {isAmharic ? 'ይቅር' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setRechargeModal({ isOpen: false, shortage: 0, requiredPrice: 0, productName: '' });
                  navigate(`/finance?tab=deposit&amount=${rechargeModal.requiredPrice}`);
                }}
                className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30"
              >
                {isAmharic ? 'አሁን ይሙሉ' : 'Recharge now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
