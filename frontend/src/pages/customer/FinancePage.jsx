import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Eye,
  RefreshCw,
  Repeat,
  Camera,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const FinancePage = () => {
  const { user, isAmharic, t, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Tab state: defaults to URL param or 'deposit'
  const initialTab = searchParams.get('tab') === 'withdraw' ? 'withdraw' : 'deposit';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Accounts list matching Image 1
  const ACCOUNTS = [
    {
      id: 'CBE',
      provider: 'Commercial Bank of Ethiopia',
      providerAmharic: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
      accountName: 'Mulugeta Siraj',
      accountNumber: '1000772513376',
      badge: 'CBE Birr / Mobile',
      logo: '🏦',
    },
    {
      id: 'TELEBIRR',
      provider: 'Telebirr',
      providerAmharic: 'ቴሌብር (Telebirr)',
      accountName: 'Ethio Rewards Official',
      accountNumber: '0911000000',
      badge: 'ፈጣን / Instant',
      logo: '📱',
    },
    {
      id: 'BOA',
      provider: 'Bank of Abyssinia',
      providerAmharic: 'አቢሲኒያ ባንክ (BOA)',
      accountName: 'Ethio Rewards Platform',
      accountNumber: '8821902134',
      badge: 'BOA Mobile',
      logo: '💳',
    },
  ];

  const [selectedChannelIdx, setSelectedChannelIdx] = useState(0);
  const currentAccount = ACCOUNTS[selectedChannelIdx];

  // Deposit Form State (Default 1500 ETB matching Image 1)
  const [orderAmount, setOrderAmount] = useState(1500);
  const [customAmountInput, setCustomAmountInput] = useState('1500');
  const [pastedProof, setPastedProof] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [copiedField, setCopiedField] = useState(null);

  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMessage, setDepositMessage] = useState(null);

  // Live countdown timer (starts at 30 minutes) matching Image 1
  const [secondsRemaining, setSecondsRemaining] = useState(1791); // 29 Min 51 Sec

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const minTen = Math.floor(minutes / 10);
  const minOne = minutes % 10;
  const secTen = Math.floor(seconds / 10);
  const secOne = seconds % 10;

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('TELEBIRR');
  const [destAccount, setDestAccount] = useState(user?.phone || '');
  const [destName, setDestName] = useState(user?.name || '');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState(null);

  // Histories
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [fetchingHistories, setFetchingHistories] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    setFetchingHistories(true);
    try {
      const [depRes, withRes] = await Promise.all([
        api.get('/finance/my-deposits'),
        api.get('/finance/my-withdrawals'),
      ]);
      if (depRes.data?.success) setDeposits(depRes.data.deposits);
      if (withRes.data?.success) setWithdrawals(withRes.data.withdrawals);
    } catch (err) {
      console.error('Error fetching finance history:', err);
    } finally {
      setFetchingHistories(false);
    }
  };

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSwitchChannel = () => {
    setSelectedChannelIdx((prev) => (prev + 1) % ACCOUNTS.length);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(isAmharic ? 'የምስሉ መጠን ከ 5MB መብለጥ የለበትም።' : 'Screenshot size must be under 5MB.');
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Smart Extractor for Ethiopian Payment Codes (v2-, FT, Telebirr)
  const extractTransactionReference = (text) => {
    const raw = text.trim();
    if (!raw) return '';

    // Check if it's a CBE receipt URL (e.g. https://mbreciept.cbe.com.et/v2-hfHCx...)
    const urlMatch = raw.match(/v2-[a-zA-Z0-9_-]+/i);
    if (urlMatch) return urlMatch[0];

    // Check for FT code (e.g. FT240129...)
    const ftMatch = raw.match(/FT[0-9A-Za-z]{8,14}/i);
    if (ftMatch) return ftMatch[0];

    // Check for Telebirr 10-digit ID or alphanumeric ref
    const tbMatch = raw.match(/[0-9A-Z]{9,14}/i);
    if (tbMatch) return tbMatch[0];

    return raw;
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setDepositMessage(null);

    const amount = Number(orderAmount);
    if (!amount || amount < 10) {
      setDepositMessage({
        type: 'error',
        text: isAmharic ? 'አነስተኛው የማስገቢያ መጠን 10 ብር ነው።' : 'Minimum deposit is 10 ETB.',
      });
      return;
    }

    const ref = extractTransactionReference(pastedProof);
    if (!ref) {
      setDepositMessage({
        type: 'error',
        text: isAmharic
          ? 'እባክዎ የግብይት ማረጋገጫ ቁጥር (Txn ID/v2-/FT) ያስገቡ ወይም ደረሰኙን ይለጥፉ።'
          : 'Please enter transaction reference code (v2- / FT / Telebirr ID) or paste the receipt link.',
      });
      return;
    }

    try {
      setDepositLoading(true);
      const res = await api.post('/finance/deposit', {
        amountETB: amount,
        paymentMethod: currentAccount.id,
        transactionRef: ref,
        screenshotUrl: screenshotBase64 || '',
        senderPhoneOrAccount: user?.phone || '',
        userNote: pastedProof,
      });

      if (res.data?.success) {
        setDepositMessage({
          type: 'success',
          text: isAmharic
            ? 'የማስገቢያ ጥያቄዎ በተሳካ ሁኔታ ቀርቧል! አስተዳዳሪው አረጋግጦ ወዲያውኑ ወደ ቦርሳዎ ገቢ ያደርጋል።'
            : res.data.message,
        });
        setPastedProof('');
        setScreenshotBase64('');
        setScreenshotFileName('');
        fetchHistories();
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      setDepositMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          (isAmharic ? 'የማስገቢያ ጥያቄውን ማቅረብ አልተቻለም።' : 'Failed to submit deposit request.'),
      });
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawMessage(null);

    const amount = Number(withdrawAmount);
    if (!amount || amount < 50) {
      setWithdrawMessage({
        type: 'error',
        text: isAmharic ? 'አነስተኛው የማውጫ መጠን 50 ብር ነው።' : 'Minimum withdrawal is 50 ETB.',
      });
      return;
    }

    if (!destAccount.trim() || !destName.trim()) {
      setWithdrawMessage({
        type: 'error',
        text: isAmharic
          ? 'እባክዎ የተቀባይ ስልክ/አካውንት እና ሙሉ ስም ያስገቡ።'
          : 'Please enter recipient account and full name.',
      });
      return;
    }

    try {
      setWithdrawLoading(true);
      const res = await api.post('/finance/withdraw', {
        amountETB: amount,
        method: withdrawMethod,
        accountNumber: destAccount.trim(),
        accountHolderName: destName.trim(),
      });

      if (res.data?.success) {
        setWithdrawMessage({
          type: 'success',
          text: isAmharic
            ? `የ ${amount} ብር ማውጫ ጥያቄዎ ቀርቧል! አስተዳዳሪው ፈትሾ ወደ ተጠቀሰው አካውንት ይልክልዎታል።`
            : res.data.message,
        });
        setWithdrawAmount('');
        fetchHistories();
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      setWithdrawMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          (isAmharic ? 'የማውጫ ጥያቄውን ማቅረብ አልተቻለም።' : 'Failed to submit withdrawal.'),
      });
    } finally {
      setWithdrawLoading(false);
    }
  };

  const walletCash = user?.walletBalanceETB || 0;
  const pointsCashValue = (user?.pointsBalance || 0) * 0.1;
  const totalBalance = walletCash + pointsCashValue;

  return (
    <div className="min-h-screen bg-slate-900 pb-28 pt-2 selection:bg-purple-600 selection:text-white">
      {/* Top Countdown Bar matching Image 1 */}
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
        {/* Brand Logo on Left */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
            🪙
          </div>
          <span className="font-black text-xs tracking-tight text-slate-200 hidden sm:inline">
            EthioRewards
          </span>
        </div>

        {/* Live Countdown Box matching Image 1: Order Remaining [2][9] Min [5][1] Sec */}
        <div className="flex items-center space-x-1 text-xs font-semibold text-slate-300">
          <span className="text-[11px] text-slate-400 mr-1">Order Remaining</span>
          <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-black text-amber-300 text-xs">
            {minTen}
          </div>
          <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-black text-amber-300 text-xs">
            {minOne}
          </div>
          <span className="text-[10px] text-slate-400 font-bold px-0.5">Min</span>
          <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-black text-amber-300 text-xs">
            {secTen}
          </div>
          <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-black text-amber-300 text-xs">
            {secOne}
          </div>
          <span className="text-[10px] text-slate-400 font-bold px-0.5">Sec</span>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Segmented Top Tabs: Top up (Deposit) vs Withdraw */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'deposit'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👛 {isAmharic ? 'ገንዘብ አስገባ (Top Up)' : 'Top Up'}</span>
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'withdraw'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🪙 {isAmharic ? 'ገንዘብ አውጣ (Withdraw)' : 'Withdraw'}</span>
          </button>
        </div>

        {/* ================= TAB 1: TOP UP / DEPOSIT (MATCHING IMAGE 1 EXACTLY) ================= */}
        {activeTab === 'deposit' && (
          <div className="space-y-4">
            {/* Quick Amount Selector Chips */}
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {isAmharic ? 'የማስገቢያ መጠን ይምረጡ' : 'Select Top Up Amount (ETB)'}:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-black">
                {[500, 1000, 1500, 3000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setOrderAmount(amt);
                      setCustomAmountInput(String(amt));
                    }}
                    className={`py-2 px-2 rounded-xl border text-center transition-all ${
                      orderAmount === amt
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs scale-102'
                        : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    ETB {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Order Card matching Image 1 */}
            <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
              {/* Step 1: Copy account for payment */}
              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Step 1 Copy account for payment</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Account
                  </span>
                </h3>

                {/* Gray Box matching Image 1 */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3 text-xs">
                  {/* Order Amount */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                    <span className="text-slate-500 font-bold">Order Amount</span>
                    <span className="font-black text-base sm:text-lg text-purple-900 font-mono tracking-tight">
                      ETB {orderAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Payment Channel with (switch) button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Payment Channel
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {currentAccount.provider}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSwitchChannel}
                      className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-200/70 text-[11px] font-bold transition-colors flex items-center space-x-1"
                    >
                      <Repeat className="w-3 h-3 text-purple-700" />
                      <span>switch</span>
                    </button>
                  </div>

                  {/* Account Name with (copy) button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Account Name
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {currentAccount.accountName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('name', currentAccount.accountName)}
                      className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-200/70 text-[11px] font-bold transition-colors"
                    >
                      {copiedField === 'name' ? '✓ copied' : 'copy'}
                    </button>
                  </div>

                  {/* Account Number with (copy) button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Account Number
                      </span>
                      <span className="font-mono font-black text-slate-900 text-sm sm:text-base tracking-wider">
                        {currentAccount.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('num', currentAccount.accountNumber)}
                      className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-200/70 text-[11px] font-bold transition-colors"
                    >
                      {copiedField === 'num' ? '✓ copied' : 'copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Amharic Payment Code Instruction matching Image 1 */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs space-y-1 font-semibold leading-relaxed">
                <p className="font-bold text-amber-900">
                  ግብይት ከተጠናቀቀ → እባክዎን ይመልከቱ ኮድ ይጀምራል በ: "v2-" ወይም "FT"
                </p>
                <p className="flex items-center space-x-1 text-[11px]">
                  <span>🔹</span>
                  <span>v2-hf = 23 አሃዝ ኮድ ያስገቡ</span>
                </p>
                <p className="flex items-center space-x-1 text-[11px]">
                  <span>🔹</span>
                  <span>FT = 12 አሃዝ ኮድ ያስገቡ</span>
                </p>
                <p className="flex items-center space-x-1 text-[11px]">
                  <span>🔹</span>
                  <span>ቴሌብር = 10 አሃዝ ብቻ ፣ ፊደል አይፈቅድም</span>
                </p>
              </div>

              {/* Step 2: Paste payment SMS or enter v2- or FT matching Image 1 */}
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-red-600 mb-2">
                    Step 2 Paste payment SMS or enter v2- or FT
                  </h4>
                  <div className="relative">
                    <textarea
                      rows={4}
                      required
                      value={pastedProof}
                      onChange={(e) => setPastedProof(e.target.value)}
                      placeholder={`ማስረጃ ማረጋገጫውን እዚህ ለጥፉ፣ ወይም ኮዱን ያስገቡ (FT ወይም v2-):\n\nhttps://mbreciept.cbe.com.et/v2-hfHCxFT8tBhc0zxe95aa`}
                      className="w-full p-3.5 rounded-2xl border-2 border-slate-300 focus:border-purple-600 focus:outline-none text-xs font-mono font-semibold text-slate-900 placeholder:text-slate-400 bg-slate-50/60 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Optional Screenshot upload preview */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-purple-700" />
                    <span className="text-slate-600 font-semibold truncate max-w-[200px]">
                      {screenshotFileName || (isAmharic ? 'ስክሪንሹት ማያያዝ (አስገዳጅ ያልሆነ)' : 'Attach screenshot (Optional)')}
                    </span>
                  </div>
                  <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-[11px] text-slate-800 shrink-0">
                    <span>{screenshotBase64 ? 'Change' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {depositMessage && (
                  <div
                    className={`p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
                      depositMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <span>{depositMessage.type === 'success' ? '✓' : '⚠️'}</span>
                    <span>{depositMessage.text}</span>
                  </div>
                )}

                {/* Big Purple/Slate Submit Button matching Image 1 */}
                <button
                  type="submit"
                  disabled={depositLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white font-black text-sm tracking-wide shadow-lg shadow-purple-900/30 active:scale-98 transition-all flex items-center justify-center space-x-2"
                >
                  {depositLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            </div>

            {/* My Recent Deposits */}
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('myDepositsTitle')}
                </span>
                <button
                  onClick={fetchHistories}
                  className="text-slate-400 hover:text-white"
                  title="Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fetchingHistories ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {deposits.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">{t('noDepositsYet')}</p>
              ) : (
                <div className="space-y-2">
                  {deposits.slice(0, 5).map((d) => (
                    <div
                      key={d._id}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">+{d.amountETB} ETB</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {d.paymentMethod}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 truncate max-w-[180px]">
                          Ref: {d.transactionRef}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          d.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : d.status === 'REJECTED'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: WITHDRAWAL ================= */}
        {activeTab === 'withdraw' && (
          <div className="space-y-4">
            {/* Balance Widget */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-5 rounded-3xl border border-emerald-700/50 text-white shadow-xl">
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">
                {isAmharic ? 'ለማውጣት ዝግጁ የሆነ ሂሳብ' : 'Available Balance for Withdrawal'}
              </span>
              <div className="text-3xl font-black text-amber-300 mt-1">
                ETB {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isAmharic ? 'ዝቅተኛው የማውጫ መጠን: 50 ብር' : 'Minimum withdrawal: 50 ETB'}
              </p>
            </div>

            {/* Withdrawal Form */}
            <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                {t('withdrawFormTitle')}
              </h3>

              {withdrawMessage && (
                <div
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
                    withdrawMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <span>{withdrawMessage.type === 'success' ? '✓' : '⚠️'}</span>
                  <span>{withdrawMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('withdrawAmountLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="50"
                      required
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-600 focus:outline-none text-sm font-black text-slate-900"
                    />
                    <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                      ETB
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('withdrawMethodLabel')}
                  </label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-600 focus:outline-none text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="TELEBIRR">📱 ቴሌብር (Telebirr)</option>
                    <option value="CBE_BIRR">🏦 ሲቢኢ ብር (CBE Birr)</option>
                    <option value="BANK_TRANSFER">🏛️ ንግድ ባንክ (CBE Bank Account)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('destAccountLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={destAccount}
                    onChange={(e) => setDestAccount(e.target.value)}
                    placeholder="+251911223344"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-purple-600 focus:outline-none text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('destNameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    placeholder="e.g. Abebe Bikila"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-purple-600 focus:outline-none text-xs font-bold text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={withdrawLoading || totalBalance < 50}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 hover:from-purple-900 text-white font-black text-sm shadow-md active:scale-98 transition-all disabled:opacity-50"
                >
                  {withdrawLoading ? '...' : (isAmharic ? 'የማውጫ ጥያቄ ላክ' : 'Submit Withdrawal')}
                </button>
              </form>
            </div>

            {/* Recent Withdrawals */}
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 text-white space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                {t('myWithdrawalsTitle')}
              </span>
              {withdrawals.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">{t('noWithdrawalsYet')}</p>
              ) : (
                <div className="space-y-2">
                  {withdrawals.slice(0, 5).map((w) => (
                    <div
                      key={w._id}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">-{w.amountETB} ETB</span>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {w.method} • {w.accountNumber}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          w.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : w.status === 'REJECTED'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};