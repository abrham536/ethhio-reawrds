import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  Headphones,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Lock,
  Building,
  User,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const WithdrawPage = () => {
  const { user, isAmharic, t, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [tradePassword, setTradePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  // Bank card state
  const [bankCard, setBankCard] = useState(user?.bankCard || { isBound: false });
  const [isBindPromptOpen, setIsBindPromptOpen] = useState(false);
  const [isBindFormOpen, setIsBindFormOpen] = useState(false);

  // Bind Form inputs
  const [selectedBank, setSelectedBank] = useState('Commercial Bank of Ethiopia (CBE)');
  const [holderName, setHolderName] = useState(user?.name || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [bindPassword, setBindPassword] = useState('');
  const [binding, setBinding] = useState(false);

  // Available withdraw balance
  const withdrawBalance =
    (user?.withdrawBalance || 0) +
    (user?.productIncome || 0) +
    ((user?.pointsBalance || 0) * 0.1);

  useEffect(() => {
    fetchBankCard();
    if (searchParams.get('bind') === 'true') {
      setIsBindFormOpen(true);
    }
  }, []);

  const fetchBankCard = async () => {
    try {
      const res = await api.get('/finance/bank-card');
      if (res.data?.success && res.data.bankCard?.isBound) {
        setBankCard(res.data.bankCard);
      }
    } catch (err) {
      console.error('Error fetching bank card', err);
    }
  };

  const handleWithdrawClick = async (e) => {
    e.preventDefault();

    if (!bankCard?.isBound) {
      setIsBindPromptOpen(true);
      return;
    }

    const amt = Number(withdrawAmount);
    if (!amt || amt < 180) {
      setNotice({
        type: 'error',
        message: isAmharic
          ? 'ዝቅተኛው የማውጣት መጠን 180 ብር ነው።'
          : 'Minimum withdrawal amount is Br180.00.',
      });
      return;
    }

    if (amt > withdrawBalance) {
      setNotice({
        type: 'error',
        message: isAmharic
          ? `በቂ ሂሳብ የለም። ያለዎት ለማውጣት የሚገኝ ሂሳብ Br${withdrawBalance.toFixed(2)} ነው።`
          : `Insufficient balance. Available to withdraw is Br${withdrawBalance.toFixed(2)}.`,
      });
      return;
    }

    if (!tradePassword || tradePassword.length < 4) {
      setNotice({
        type: 'error',
        message: isAmharic
          ? 'እባክዎ ትክክለኛ የንግድ ምስጢር ቃል ያስገቡ።'
          : 'Please enter your trade security password.',
      });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/finance/withdraw', {
        amountETB: amt,
        method: bankCard.bank,
        accountNumber: bankCard.accountNumber,
        accountHolderName: bankCard.accountHolderName,
      });

      if (res.data?.success) {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        setNotice({
          type: 'success',
          message: res.data.message || (isAmharic ? 'የማውጫ ጥያቄዎ በተሳካ ሁኔታ ቀርቧል!' : 'Withdrawal request submitted successfully!'),
        });
        setWithdrawAmount('');
        setTradePassword('');
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.response?.data?.message || (isAmharic ? 'የማውጣት ሂደቱ አልተሳካም። እባክዎ እንደገና ይሞክሩ።' : 'Withdrawal failed. Please try again.'),
      });
    } finally {
      setLoading(false);
      setTimeout(() => setNotice(null), 5000);
    }
  };

  const handleSaveBankCard = async (e) => {
    e.preventDefault();
    if (!accountNumber || !holderName) {
      alert(isAmharic ? 'እባክዎ ሁሉንም መረጃዎች በትክክል ይሙሉ' : 'Please fill all fields');
      return;
    }
    if (!bindPassword || bindPassword.length < 4) {
      alert(isAmharic ? 'የንግድ ምስጢር ቃል ቢያንስ 4 አሃዝ መሆን አለበት' : 'Trade password must be at least 4 digits');
      return;
    }

    try {
      setBinding(true);
      const res = await api.post('/finance/bind-card', {
        bank: selectedBank,
        accountHolderName: holderName,
        accountNumber: accountNumber,
        tradePassword: bindPassword,
      });

      if (res.data?.success) {
        setBankCard(res.data.bankCard);
        setIsBindFormOpen(false);
        setIsBindPromptOpen(false);
        confetti({ particleCount: 50, spread: 60 });
        setNotice({
          type: 'success',
          message: isAmharic ? '🎉 የባንክ ካርድዎ በተሳካ ሁኔታ ታስሯል!' : '🎉 Bank card linked successfully!',
        });
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to bind bank card');
    } finally {
      setBinding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 pb-28 pt-3 px-3 sm:px-5 max-w-lg mx-auto relative">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-black tracking-wide text-white">
          {isAmharic ? 'ገንዘብ ማውጫ' : 'Withdraw'}
        </h1>

        <button
          onClick={() => navigate('/orders')}
          className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
          title="History"
        >
          <Clock className="w-4 h-4" />
        </button>
      </div>

      {/* Withdraw Balance Card matching Screenshot 4 */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center shadow-xl mb-5 space-y-1">
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
          {isAmharic ? 'ለማውጣት የሚገኝ ሂሳብ' : 'Withdraw Balance'}
        </span>
        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Br{withdrawBalance.toFixed(2)}
        </div>
      </div>

      {/* Alert Notice */}
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

      {/* Withdrawal Form */}
      <form onSubmit={handleWithdrawClick} className="space-y-4">
        {/* Section | AMOUNT */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 px-1">
            <div className="w-1.5 h-3.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">
              {isAmharic ? 'የገንዘብ መጠን' : 'AMOUNT'}
            </span>
          </div>

          <div className="flex items-center rounded-2xl bg-[#0f172a] border border-slate-800 px-4 py-3.5 focus-within:border-emerald-500 transition-colors">
            <span className="text-slate-400 font-black text-sm mr-3">Br</span>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={isAmharic ? 'የማውጣት መጠን ያስገቡ (Br180 - Br2550000)' : 'Enter amount (Br180 - Br2550000)'}
              className="w-full bg-transparent text-white font-black text-base focus:outline-none placeholder-slate-600"
            />
          </div>
        </div>

        {/* Section | SECURITY */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 px-1">
            <div className="w-1.5 h-3.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">
              {isAmharic ? 'ደህንነት እና የባንክ ካርድ' : 'SECURITY'}
            </span>
          </div>

          {bankCard?.isBound ? (
            <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">
                  🏦
                </div>
                <div>
                  <p className="font-bold text-xs text-white">{bankCard.bank}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {bankCard.accountHolderName} • {bankCard.accountNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBindFormOpen(true)}
                className="text-[10px] text-emerald-400 font-bold px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20"
              >
                {isAmharic ? 'ቀይር' : 'Change'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsBindFormOpen(true)}
              className="w-full p-3.5 rounded-2xl bg-[#0f172a] border border-amber-500/40 flex items-center justify-between text-left hover:border-amber-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-lg">
                  ⚠️
                </div>
                <div>
                  <p className="font-bold text-xs text-white">
                    {isAmharic ? 'የባንክ ካርድ አላገናኙም' : 'No Bank Card Linked'}
                  </p>
                  <p className="text-[10px] text-amber-400 font-semibold">
                    {isAmharic ? 'ገንዘብ ለማውጣት ካርድ ማሰር ያስፈልጋል' : 'Link card now to withdraw funds'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-400">
                {isAmharic ? 'አሁን እሰር >' : 'Link >'}
              </span>
            </button>
          )}

          {/* Trade Password Input */}
          <div className="flex items-center rounded-2xl bg-[#0f172a] border border-slate-800 px-4 py-3.5 focus-within:border-emerald-500 transition-colors mt-2">
            <Lock className="w-4 h-4 text-slate-500 mr-3" />
            <input
              type="password"
              value={tradePassword}
              onChange={(e) => setTradePassword(e.target.value)}
              placeholder={isAmharic ? 'የንግድ ምስጢር ቃል ያስገቡ (Trade Password)' : 'Enter 6-digit Trade Password'}
              className="w-full bg-transparent text-white font-medium text-xs sm:text-sm focus:outline-none placeholder-slate-600"
            />
          </div>
        </div>

        {/* Submit Withdraw Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 active:scale-98 transition-all disabled:opacity-60"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>{isAmharic ? 'አሁን ገንዘብ አውጣ' : 'Withdraw now'}</span>
          )}
        </button>
      </form>

      {/* Notice Box matching Screenshot 4 */}
      <div className="mt-6 rounded-3xl bg-[#0f172a] border border-slate-800 p-4 space-y-2 text-[11px] text-slate-400">
        <div className="flex items-center space-x-2 px-1 mb-1">
          <div className="w-1.5 h-3.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-black tracking-wider uppercase text-slate-300">
            {isAmharic ? 'የማውጣት ደንቦች' : 'NOTICE'}
          </span>
        </div>

        <p className="leading-relaxed">1. Withdrawal Time: 10:00 — 17:30 (EAT)</p>
        <p className="leading-relaxed">2. Amount range: Br180 — Br2550000</p>
        <p className="leading-relaxed">3. Max 1 withdrawals per day</p>
        <p className="leading-relaxed">4. Withdrawal rate: 5%</p>
      </div>

      {/* Floating Headset Support Button matching Screenshot 4 */}
      <button
        onClick={() => alert(isAmharic ? 'የደንበኞች ድጋፍ አገልግሎት፡ Telegram @EthioRewardsSupport' : 'Support: Telegram @EthioRewardsSupport')}
        className="fixed bottom-20 right-5 w-12 h-12 rounded-full bg-slate-900 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-950/60 active:scale-95 transition-transform"
        aria-label="Support"
      >
        <Headphones className="w-5 h-5" />
      </button>

      {/* Bind Bank Card Modal Prompt matching Screenshot 4 */}
      {isBindPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsBindPromptOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl">
              i
            </div>

            <div>
              <h3 className="text-base font-black text-white">
                {isAmharic ? 'የባንክ ካርድ ያስሩ' : 'Bind bank card'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {isAmharic
                  ? 'እስካሁን የባንክ ካርድ አላገናኙም። እባክዎ መጀመሪያ ካርድዎን ያገናኙ።'
                  : "You haven't linked your bank card yet. Please link a bank card first."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsBindPromptOpen(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {isAmharic ? 'ይቅር' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBindPromptOpen(false);
                  setIsBindFormOpen(true);
                }}
                className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30"
              >
                {isAmharic ? 'አሁን እሰር' : 'Bind now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bind Bank Card Sheet / Form Modal */}
      {isBindFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsBindFormOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black text-white">
                {isAmharic ? 'የባንክ ወይም ቴሌብር ሂሳብ ማሰሪያ' : 'Link Bank / Telebirr Account'}
              </h3>
            </div>

            <form onSubmit={handleSaveBankCard} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  {isAmharic ? 'ባንክ ወይም አገልግሎት ይምረጡ' : 'Select Bank'}
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 text-white p-3 font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                  <option value="Telebirr">Telebirr (ቴሌብር)</option>
                  <option value="Dashen Bank">Dashen Bank (ዳሽን ባንክ)</option>
                  <option value="Bank of Abyssinia (BOA)">Bank of Abyssinia (አቢሲኒያ)</option>
                  <option value="Awash Bank">Awash Bank (አዋሽ ባንክ)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  {isAmharic ? 'የአካውንት ባለቤት ስም (እንደ ባንክ/ቴሌብር)' : 'Cardholder / Account Name'}
                </label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="e.g. Abebe Bikila"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 text-white p-3 font-semibold focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  {isAmharic ? 'የአካውንት / ቴሌብር ስልክ ቁጥር' : 'Account / Phone Number'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 1000123456789 or 0911000000"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 text-white p-3 font-semibold focus:border-emerald-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  {isAmharic ? 'የንግድ ምስጢር ቃል (6 አሃዝ)' : '6-digit Trade Password'}
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={bindPassword}
                  onChange={(e) => setBindPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 text-white p-3 font-semibold focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={binding}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30 flex items-center justify-center space-x-2"
                >
                  {binding ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{isAmharic ? 'አረጋግጥና አስር (Confirm)' : 'Confirm & Bind'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
