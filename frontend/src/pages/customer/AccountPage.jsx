import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gem,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  CreditCard,
  ChevronRight,
  Gift,
  Users,
  HelpCircle,
  Settings,
  Shield,
  LogOut,
  Wallet,
  Sparkles,
  CheckCircle2,
  Copy,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const AccountPage = () => {
  const { user, logout, isAmharic, toggleLanguage, changeLanguage, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    productIncome: user?.productIncome || 0,
    rechargeBalance: (user?.rechargeBalance || 0) + (user?.walletBalanceETB || 0),
    withdrawBalance: (user?.withdrawBalance || 0) + ((user?.pointsBalance || 0) * 0.1),
    vipLevel: user?.vipLevel || 0,
    activeOrdersCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelPrize, setWheelPrize] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'balance' | 'vip' | 'team' | 'help' | 'settings'
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/invest/account-stats');
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  const spinLuckyWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelPrize(null);

    const prizes = [
      { name: 'Br 50.00 Bonus', value: 50 },
      { name: 'Br 100.00 Cashback', value: 100 },
      { name: 'VIP 1 Fastpass', value: 10 },
      { name: 'Br 25.00 Airtime', value: 25 },
      { name: 'Br 200.00 Voucher', value: 200 },
    ];
    const picked = prizes[Math.floor(Math.random() * prizes.length)];

    setTimeout(() => {
      setWheelSpinning(false);
      setWheelPrize(picked);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      if (refreshUser) refreshUser();
    }, 2400);
  };

  const handleCopyCode = () => {
    const code = user?.referralCode || 'ETHIOREWARDS';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const nextVip = (stats.vipLevel || 0) + 1;
  const upgradeCost = nextVip === 1 ? 500 : nextVip === 2 ? 3060 : nextVip === 3 ? 17000 : 69000;

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 pb-28 pt-4 px-3 sm:px-5 max-w-lg mx-auto">
      {/* Top 3-Column Stats Card matching Screenshot 3 */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-4 sm:p-5 shadow-xl mb-4">
        <div className="grid grid-cols-3 divide-x divide-slate-800 text-center">
          <div className="px-2">
            <div className="text-lg sm:text-xl font-black text-white">
              {Number(stats.productIncome || 0).toFixed(2)}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              {isAmharic ? 'የምርት ትርፍ' : 'Product Income'}
            </p>
          </div>

          <div className="px-2">
            <div className="text-lg sm:text-xl font-black text-white">
              {Number(stats.rechargeBalance || 0).toFixed(2)}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              {isAmharic ? 'የተሞላ ሂሳብ' : 'Recharge Balance'}
            </p>
          </div>

          <div className="px-2">
            <div className="text-lg sm:text-xl font-black text-white">
              {Number(stats.withdrawBalance || 0).toFixed(2)}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              {isAmharic ? 'የሚወጣ ሂሳብ' : 'Withdraw Balance'}
            </p>
          </div>
        </div>
      </div>

      {/* VIP Level Card matching Screenshot 3 */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c2e22] via-[#091f19] to-[#0f172a] border border-emerald-500/40 p-5 shadow-xl shadow-emerald-950/40 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Gem className="w-5 h-5 text-emerald-400" />
            <span className="text-base font-black text-white tracking-wide">
              VIP {stats.vipLevel || 0}
            </span>
          </div>

          <button
            onClick={() => navigate('/invest')}
            className="px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center space-x-1 active:scale-95 transition-all"
          >
            <span>{isAmharic ? 'ደረጃ ያሳድጉ >' : 'Upgrade >'}</span>
          </button>
        </div>

        <p className="text-xs text-emerald-200/80 font-medium mb-3">
          {isAmharic
            ? `VIP ${nextVip} ለመክፈት Br${upgradeCost.toLocaleString()} ኢንቨስት ያድርጉ`
            : `Invest Br${upgradeCost.toLocaleString()} more to unlock VIP ${nextVip}`}
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(15, (stats.vipLevel || 0) * 15))}%` }}
          />
        </div>
      </div>

      {/* 4 Action Circle Icons row matching Screenshot 3 */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-4 shadow-lg mb-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Recharge */}
          <Link
            to="/finance?tab=deposit"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg font-black group-hover:bg-emerald-500/20 shadow-md">
              ¥
            </div>
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              {isAmharic ? 'መሙያ' : 'Recharge'}
            </span>
          </Link>

          {/* Withdraw */}
          <Link
            to="/withdraw"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-sm font-black group-hover:bg-blue-500/20 shadow-md">
              0:0
            </div>
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              {isAmharic ? 'ማውጫ' : 'Withdraw'}
            </span>
          </Link>

          {/* Orders */}
          <Link
            to="/orders"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-base group-hover:bg-amber-500/20 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              {isAmharic ? 'ትዕዛዞች' : 'Orders'}
            </span>
          </Link>

          {/* Cards */}
          <Link
            to="/withdraw?bind=true"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center text-base group-hover:bg-yellow-500/20 shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              {isAmharic ? 'ካርዶች' : 'Cards'}
            </span>
          </Link>
        </div>
      </div>

      {/* Lucky Wheel Orange Banner matching Screenshot 3 */}
      <button
        onClick={() => setIsWheelOpen(true)}
        className="w-full rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 flex items-center justify-between text-white shadow-xl shadow-orange-950/40 hover:brightness-105 active:scale-98 transition-all mb-5 text-left"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
            🎁
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {isAmharic ? 'የዕድል እሽክርክሪት' : 'Lucky Wheel'}
            </h3>
            <p className="text-[11px] text-amber-100 font-semibold mt-0.5">
              {isAmharic ? 'አጓጊ ሽልማቶችን ለማሸነፍ ያሽከርክሩ' : 'Spin to win amazing prizes'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/80" />
      </button>

      {/* Application Service section matching Screenshot 3 */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-4 shadow-lg mb-6">
        <div className="flex items-center space-x-2 mb-3 px-1">
          <div className="w-1.5 h-4 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
          <span className="text-xs font-black tracking-wider uppercase text-slate-200">
            {isAmharic ? 'የመተግበሪያ አገልግሎት' : 'Application Service'}
          </span>
        </div>

        <div className="space-y-1">
          {/* My Balance */}
          <button
            onClick={() => setActiveModal('balance')}
            className="w-full p-3 rounded-2xl hover:bg-slate-800/60 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                ¥
              </div>
              <span className="text-xs font-bold text-slate-200">
                {isAmharic ? 'የእኔ ሂሳብ' : 'My Balance'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* My Rewards */}
          <button
            onClick={() => setActiveModal('rewards')}
            className="w-full p-3 rounded-2xl hover:bg-slate-800/60 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                {isAmharic ? 'የእኔ ሽልማቶች' : 'My Rewards'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* VIP Level */}
          <button
            onClick={() => setActiveModal('vip')}
            className="w-full p-3 rounded-2xl hover:bg-slate-800/60 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Gem className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                {isAmharic ? 'የቪአይፒ ደረጃ' : 'VIP Level'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* My Team */}
          <button
            onClick={() => setActiveModal('team')}
            className="w-full p-3 rounded-2xl hover:bg-slate-800/60 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                {isAmharic ? 'የእኔ ቡድን' : 'My Team'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Help Center */}
          <button
            onClick={() => setActiveModal('help')}
            className="w-full p-3 rounded-2xl hover:bg-slate-800/60 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                {isAmharic ? 'የእርዳታ ማዕከል' : 'Help Center'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveModal('settings')}
            className="w-full p-3 rounded-2xl hover:bg-slate-800/60 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-700/30 text-slate-400 flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                {isAmharic ? 'ቅንብሮች' : 'Settings'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Lucky Wheel Modal */}
      {isWheelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsWheelOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white">
                🎁 {isAmharic ? 'የዕድል እሽክርክሪት (100% አሸናፊ)' : 'Lucky Wheel (100% Win Rate)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAmharic ? 'ያሽከርክሩና ነፃ የብር ጉርሻዎችን ያሸንፉ!' : 'Spin and win instant Birr prizes!'}
              </p>
            </div>

            {/* Circular spinner graphic */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <div
                className={`w-full h-full rounded-full border-4 border-amber-500/50 bg-gradient-to-tr from-amber-600 via-emerald-600 to-amber-500 shadow-xl flex items-center justify-center text-4xl ${
                  wheelSpinning ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '0.6s' }}
              >
                🎯
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center text-xs font-black text-amber-400 shadow-md">
                  P&G
                </div>
              </div>
            </div>

            {wheelPrize && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-scale-up">
                🎉 {isAmharic ? 'እንኳን ደስ አለዎት! ያሸነፉት፡' : 'Congratulations! You won:'} {wheelPrize.name}
              </div>
            )}

            <button
              onClick={spinLuckyWheel}
              disabled={wheelSpinning}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/30 active:scale-95 transition-all disabled:opacity-50"
            >
              {wheelSpinning
                ? (isAmharic ? 'በማሽከርከር ላይ...' : 'Spinning...')
                : (isAmharic ? 'አሁን አሽከርክር' : 'Spin Now')}
            </button>
          </div>
        </div>
      )}

      {/* Details Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {/* My Balance Modal */}
            {activeModal === 'balance' && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <span>¥</span>
                  <span>{isAmharic ? 'የእኔ ሂሳብ ዝርዝር' : 'My Balance Details'}</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">{isAmharic ? 'የተሞላ ሂሳብ' : 'Recharge Balance'}</span>
                    <span className="font-bold text-white">Br{Number(stats.rechargeBalance || 0).toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">{isAmharic ? 'የምርት ትርፍ ገቢ' : 'Product Income'}</span>
                    <span className="font-bold text-emerald-400">Br{Number(stats.productIncome || 0).toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">{isAmharic ? 'ለማውጣት የሚገኝ' : 'Withdraw Balance'}</span>
                    <span className="font-bold text-amber-400">Br{Number(stats.withdrawBalance || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      navigate('/finance?tab=deposit');
                    }}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black text-xs"
                  >
                    {isAmharic ? 'ገንዘብ ሙላ' : 'Recharge'}
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      navigate('/withdraw');
                    }}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                  >
                    {isAmharic ? 'ገንዘብ አውጣ' : 'Withdraw'}
                  </button>
                </div>
              </div>
            )}

            {/* My Rewards Modal */}
            {activeModal === 'rewards' && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-orange-400" />
                  <span>{isAmharic ? 'የእኔ ሽልማቶች' : 'My Rewards'}</span>
                </h3>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <span className="text-3xl font-black text-amber-400">
                    {(user?.pointsBalance || 0).toLocaleString()}
                  </span>
                  <p className="text-xs text-slate-400">
                    {isAmharic ? 'ያለዎት ነፃ የጉርሻ ነጥቦች' : 'Active Reward Points'}
                  </p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAmharic
                    ? 'በየቀኑ በመግባት 10 ነጥቦችን (1.00 ብር) በነፃ ማግኘት ይችላሉ። እንዲሁም ጓደኞችዎን በመጋበዝ +50 ነጥቦችን ወዲያውኑ ያግኙ!'
                    : 'Earn 10 free points daily and +50 points for every invited friend!'}
                </p>
              </div>
            )}

            {/* VIP Level Modal */}
            {activeModal === 'vip' && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Gem className="w-5 h-5 text-emerald-400" />
                  <span>{isAmharic ? 'የቪአይፒ ደረጃዎች እና ጥቅሞች' : 'VIP Levels & Perks'}</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-emerald-400">VIP 1 (Br500)</span>
                    <span className="text-slate-300">Br417.40 / {isAmharic ? 'ቀን' : 'day'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-emerald-400">VIP 2 (Br3,060)</span>
                    <span className="text-slate-300">Br2,640.00 / {isAmharic ? 'ቀን' : 'day'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-emerald-400">VIP 3 (Br17,000)</span>
                    <span className="text-slate-300">Br14,700.00 / {isAmharic ? 'ቀን' : 'day'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-emerald-400">VIP 5 (Br69,000)</span>
                    <span className="text-slate-300">Br60,000.00 / {isAmharic ? 'ቀን' : 'day'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* My Team Modal */}
            {activeModal === 'team' && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>{isAmharic ? 'የእኔ ቡድን እና መጋበዣ' : 'My Team & Referral'}</span>
                </h3>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <span className="text-slate-400 block">{isAmharic ? 'የእርስዎ የመጋበዣ ኮድ፡' : 'Your Invitation Code:'}</span>
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {user?.referralCode || 'ETHIOREWARDS'}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px] hover:bg-emerald-500/30"
                    >
                      {copiedCode ? (isAmharic ? 'ኮፒ ሆኗል!' : 'Copied!') : (isAmharic ? 'ኮፒ' : 'Copy')}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const inviteUrl = `${window.location.origin}/register?invitation_code=${user?.referralCode || 'ETHIOREWARDS'}`;
                    navigator.clipboard.writeText(inviteUrl);
                    alert(isAmharic ? 'የመጋበዣ ሊንክ ኮፒ ተደርጓል!' : 'Invitation link copied!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black text-xs"
                >
                  {isAmharic ? 'የመጋበዣ ሊንክ ኮፒ ያድርጉ' : 'Copy Invitation Link'}
                </button>
              </div>
            )}

            {/* Help Center Modal */}
            {activeModal === 'help' && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-pink-400" />
                  <span>{isAmharic ? 'የእርዳታ እና ድጋፍ ማዕከል' : 'Help & Support'}</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 flex items-center justify-between text-slate-200"
                  >
                    <span>💬 Telegram Customer Service</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </a>

                  <a
                    href="https://whatsapp.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 flex items-center justify-between text-slate-200"
                  >
                    <span>📱 Official WhatsApp Channel</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </a>
                </div>
              </div>
            )}

            {/* Settings Modal */}
            {activeModal === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-slate-400" />
                  <span>{isAmharic ? 'ቅንብሮች' : 'Settings'}</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => {
                      toggleLanguage();
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 flex items-center justify-between text-slate-200"
                  >
                    <span className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>{isAmharic ? 'ቋንቋ (አማርኛ / English)' : 'Language (Amharic / English)'}</span>
                    </span>
                    <span className="font-bold text-emerald-400">{isAmharic ? '🇪🇹 አማርኛ' : '🇬🇧 English'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveModal(null);
                      navigate('/withdraw?bind=true');
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 flex items-center justify-between text-slate-200"
                  >
                    <span>{isAmharic ? 'የንግድ ምስጢር ቃል ማስተካከያ' : 'Security Trade Password'}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveModal(null);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center justify-center space-x-2 hover:bg-red-500/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isAmharic ? 'ከአካውንት ውጣ' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
