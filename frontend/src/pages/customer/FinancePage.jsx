import React, { useState, useEffect } from 'react';
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
  Building,
  Smartphone,
  Eye,
  RefreshCw,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const FinancePage = () => {
  const { user, isAmharic, t, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'withdraw'
  const [platformAccounts, setPlatformAccounts] = useState([]);
  const [copiedAccountId, setCopiedAccountId] = useState(null);

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('TELEBIRR');
  const [transactionRef, setTransactionRef] = useState('');
  const [senderAccount, setSenderAccount] = useState(user?.phone || '');
  const [userNote, setUserNote] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMessage, setDepositMessage] = useState(null);

  // Withdraw Form State
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

  // Preview Modal for Customer
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchAccounts();
    fetchHistories();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/finance/deposit-accounts');
      if (res.data?.success) {
        setPlatformAccounts(res.data.accounts);
      }
    } catch (err) {
      console.warn('Using fallback platform accounts:', err);
      // Fallback
      setPlatformAccounts([
        {
          id: 'TELEBIRR',
          provider: 'Telebirr',
          providerAmharic: 'ቴሌብር',
          accountNumber: '0911000000',
          accountName: 'Ethio Rewards Official (ኢትዮ ሪዋርድስ)',
          badge: 'ፈጣን / Instant',
          instruction: 'Send via Telebirr "Send Money" and copy the Transaction ID.',
          instructionAmharic: 'በቴሌብር «ገንዘብ ላክ» በኩል ልከው የደረሰኝ ቁጥሩን (Transaction ID) ያስገቡ።',
          logo: '📱',
        },
        {
          id: 'CBE',
          provider: 'Commercial Bank of Ethiopia (CBE)',
          providerAmharic: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
          accountNumber: '1000123456789',
          accountName: 'Ethio Rewards Technology PLC',
          badge: 'CBE Birr / CBE Mobile',
          instruction: 'Transfer via CBE Mobile Banking or CBE Birr and upload screenshot.',
          instructionAmharic: 'በንግድ ባንክ ሞባይል ባንኪንግ ወይም ሲቢኢ ብር አስተላልፈው ደረሰኝ ያያይዙ።',
          logo: '🏦',
        },
        {
          id: 'BOA',
          provider: 'Bank of Abyssinia (BOA)',
          providerAmharic: 'አቢሲኒያ ባንክ (BOA)',
          accountNumber: '8821902134',
          accountName: 'Ethio Rewards Platform',
          badge: 'BOA Mobile',
          instruction: 'Transfer via Bank of Abyssinia app and save screenshot receipt.',
          instructionAmharic: 'በአቢሲኒያ ባንክ መተግበሪያ አስተላልፈው ደረሰኝ ያያይዙ።',
          logo: '💳',
        },
      ]);
    }
  };

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

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedAccountId(id);
    setTimeout(() => setCopiedAccountId(null), 2500);
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

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setDepositMessage(null);

    const amount = Number(depositAmount);
    if (!amount || amount < 10) {
      setDepositMessage({
        type: 'error',
        text: isAmharic ? 'አነስተኛው የማስገቢያ መጠን 10 ብር ነው።' : 'Minimum deposit is 10 ETB.',
      });
      return;
    }

    if (!transactionRef.trim()) {
      setDepositMessage({
        type: 'error',
        text: isAmharic
          ? 'እባክዎ የግብይት መለያ ቁጥር (Transaction ID) ያስገቡ።'
          : 'Please enter transaction reference ID.',
      });
      return;
    }

    try {
      setDepositLoading(true);
      const res = await api.post('/finance/deposit', {
        amountETB: amount,
        paymentMethod: depositMethod,
        transactionRef: transactionRef.trim(),
        screenshotUrl: screenshotBase64,
        senderPhoneOrAccount: senderAccount,
        userNote,
      });

      if (res.data?.success) {
        setDepositMessage({
          type: 'success',
          text: isAmharic
            ? 'የማስገቢያ ጥያቄዎ በተሳካ ሁኔታ ቀርቧል! አስተዳዳሪው ደረሰኙን ሲያረጋግጥ ገንዘቡ ወዲያው ወደ ቦርሳዎ ይገባል።'
            : res.data.message,
        });
        // Reset form
        setDepositAmount('');
        setTransactionRef('');
        setUserNote('');
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

  // Balances
  const walletCash = user?.walletBalanceETB || 0;
  const pointsCashValue = (user?.pointsBalance || 0) * 0.1;
  const totalBalance = walletCash + pointsCashValue;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAmharic ? 'በአስተዳዳሪ የተረጋገጠ ክፍያ' : 'Admin Verified Payments'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t('financeTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {t('financeSubtitle')}
              </p>
            </div>

            {/* Live Balance Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 min-w-[240px]">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold block">
                {t('totalBalance')}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
                {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                <span className="text-xs text-white font-bold">{t('currency')}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>{t('walletCash')}: {walletCash.toLocaleString()} {t('currency')}</span>
                <span>•</span>
                <span>{t('points')}: {user?.pointsBalance?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex items-center space-x-2 py-3 px-6 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'deposit'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>{t('tabDeposit')}</span>
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex items-center space-x-2 py-3 px-6 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'withdraw'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
            <span>{t('tabWithdraw')}</span>
          </button>
        </div>

        {/* ================= TAB 1: DEPOSIT ================= */}
        {activeTab === 'deposit' && (
          <div className="space-y-8">
            {/* Step 1: Official Platform Bank Accounts */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {t('officialAccountsTitle')}
                  </h2>
                  <p className="text-xs text-slate-500">{t('officialAccountsDesc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {platformAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-5 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{acc.logo}</span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {acc.badge}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {isAmharic ? acc.providerAmharic : acc.provider}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {acc.accountName}
                      </p>
                      <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
                        <span className="font-mono text-base font-black text-slate-900 tracking-wider">
                          {acc.accountNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(acc.id, acc.accountNumber)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                          title={t('btnCopyAcc')}
                        >
                          {copiedAccountId === acc.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 italic">
                      {isAmharic ? acc.instructionAmharic : acc.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Deposit Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {t('depositFormTitle')}
                  </h2>
                  <p className="text-xs text-slate-500">{t('depositUnderReview')}</p>
                </div>
              </div>

              {depositMessage && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs font-semibold flex items-center space-x-3 ${
                    depositMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {depositMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span>{depositMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleDepositSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('depositAmountLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="10"
                        step="any"
                        required
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="500"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-black text-slate-900"
                      />
                      <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                        {t('currency')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('paymentMethodLabel')}
                    </label>
                    <select
                      value={depositMethod}
                      onChange={(e) => setDepositMethod(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="TELEBIRR">📱 ቴሌብር (Telebirr)</option>
                      <option value="CBE">🏦 የኢትዮጵያ ንግድ ባንክ (CBE / CBE Birr)</option>
                      <option value="BOA">💳 አቢሲኒያ ባንክ (Bank of Abyssinia)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Transaction Ref */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('transactionRefLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="5M7A883921"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono font-bold text-slate-900 uppercase"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">{t('transactionRefHint')}</p>
                  </div>

                  {/* Sender phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isAmharic ? 'የከፈሉበት ስልክ / አካውንት:' : 'Sender Phone / Account:'}
                    </label>
                    <input
                      type="text"
                      value={senderAccount}
                      onChange={(e) => setSenderAccount(e.target.value)}
                      placeholder="+251911223344"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono font-semibold text-slate-900"
                    />
                  </div>
                </div>

                {/* Screenshot Upload with Instant Preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('screenshotLabel')}
                  </label>
                  <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {screenshotFileName || t('screenshotHint')}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {isAmharic ? 'ከፍተኛ መጠን 5MB (PNG, JPG)' : 'Max 5MB (PNG, JPG)'}
                          </p>
                        </div>
                      </div>

                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 text-center shadow-xs transition-colors">
                        <span>{screenshotBase64 ? t('changeScreenshot') : (isAmharic ? 'ምስል ምረጥ' : 'Choose File')}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {screenshotBase64 && (
                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center space-x-3">
                        <img
                          src={screenshotBase64}
                          alt="Screenshot Proof"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 cursor-pointer shadow-xs"
                          onClick={() => setPreviewImage(screenshotBase64)}
                        />
                        <div className="text-xs">
                          <span className="font-bold text-emerald-700 block">
                            {isAmharic ? '✓ ምስሉ በተሳካ ሁኔታ ተያይዟል' : '✓ Screenshot Attached'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPreviewImage(screenshotBase64)}
                            className="text-[11px] text-emerald-600 underline font-semibold mt-0.5"
                          >
                            {isAmharic ? 'ትልቁን ምስል ተመልከት' : 'Preview Large'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={depositLoading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  {depositLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ArrowDownLeft className="w-4 h-4" />
                      <span>{t('btnSubmitDeposit')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* My Deposit History */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-base text-slate-900">
                  {t('myDepositsTitle')}
                </h3>
                <button
                  onClick={fetchHistories}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${fetchingHistories ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {deposits.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">{t('noDepositsYet')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b">
                      <tr>
                        <th className="py-2.5 px-3">Req #</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'ቀን' : 'Date'}</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'መንገድ' : 'Channel'}</th>
                        <th className="py-2.5 px-3">Txn Ref</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'መጠን' : 'Amount'}</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'ደረሰኝ' : 'Proof'}</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'ሁኔታ' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {deposits.map((d) => (
                        <tr key={d._id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            {d.requestNumber}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {new Date(d.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">
                            {d.paymentMethod}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-800 font-bold">
                            {d.transactionRef}
                          </td>
                          <td className="py-3 px-3 font-black text-emerald-700">
                            +{d.amountETB.toLocaleString()} {t('currency')}
                          </td>
                          <td className="py-3 px-3">
                            {d.screenshotUrl ? (
                              <button
                                onClick={() => setPreviewImage(d.screenshotUrl)}
                                className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-800 font-bold"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isAmharic ? 'ይመልከቱ' : 'View'}</span>
                              </button>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                d.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : d.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {d.status === 'APPROVED'
                                ? t('approved')
                                : d.status === 'REJECTED'
                                ? t('rejected')
                                : t('pending')}
                            </span>
                            {d.adminNote && (
                              <p className="text-[10px] text-slate-500 mt-0.5">{d.adminNote}</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: WITHDRAW ================= */}
        {activeTab === 'withdraw' && (
          <div className="space-y-8">
            {/* Withdrawal Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {t('withdrawFormTitle')}
                  </h2>
                  <p className="text-xs text-slate-500">{t('withdrawNotice')}</p>
                </div>
              </div>

              {withdrawMessage && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs font-semibold flex items-center space-x-3 ${
                    withdrawMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {withdrawMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span>{withdrawMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('withdrawAmountLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="50"
                        step="any"
                        required
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="100"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-black text-slate-900"
                      />
                      <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                        {t('currency')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isAmharic ? 'ዝቅተኛው ማውጫ: 50 ብር' : 'Min withdrawal: 50 ETB'} •{' '}
                      {isAmharic ? 'ያለዎት ጠቅላላ:' : 'Available:'}{' '}
                      <strong>{totalBalance.toFixed(2)} {t('currency')}</strong>
                    </p>
                  </div>

                  {/* Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('withdrawMethodLabel')}
                    </label>
                    <select
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="TELEBIRR">📱 ቴሌብር (Telebirr)</option>
                      <option value="CBE_BIRR">🏦 ሲቢኢ ብር (CBE Birr)</option>
                      <option value="BANK_TRANSFER">🏛️ የባንክ ሂሳብ (Bank Transfer - CBE/BOA)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dest Account */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('destAccountLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={destAccount}
                      onChange={(e) => setDestAccount(e.target.value)}
                      placeholder="+251911223344"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  {/* Dest Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('destNameLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={destName}
                      onChange={(e) => setDestName(e.target.value)}
                      placeholder="Abebe Bikila"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={withdrawLoading || totalBalance < 50}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {withdrawLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      <span>{t('btnSubmitWithdraw')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* My Withdrawal History */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-base text-slate-900">
                  {t('myWithdrawalsTitle')}
                </h3>
                <button
                  onClick={fetchHistories}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${fetchingHistories ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {withdrawals.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">{t('noWithdrawalsYet')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b">
                      <tr>
                        <th className="py-2.5 px-3">Req #</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'ቀን' : 'Date'}</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'መንገድ' : 'Method'}</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'ተቀባይ' : 'Recipient'}</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'መጠን' : 'Amount'}</th>
                        <th className="py-2.5 px-3">{isAmharic ? 'ሁኔታ' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {withdrawals.map((w) => (
                        <tr key={w._id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            {w.requestNumber}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700">{w.method}</td>
                          <td className="py-3 px-3 text-slate-800">
                            <span className="font-mono font-bold">{w.accountNumber}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {w.accountHolderName}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-black text-blue-700">
                            {w.amountETB.toLocaleString()} {t('currency')}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                w.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : w.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {w.status === 'APPROVED'
                                ? t('approved')
                                : w.status === 'REJECTED'
                                ? t('rejected')
                                : t('pending')}
                            </span>
                            {w.payoutReceiptRef && (
                              <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                                Txn: {w.payoutReceiptRef}
                              </p>
                            )}
                            {w.adminNote && (
                              <p className="text-[10px] text-slate-500 mt-0.5">{w.adminNote}</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Large Screenshot View */}
        {previewImage && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-4 overflow-hidden shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-bold text-xs text-slate-800">{t('modalProofTitle')}</h4>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 font-bold text-xs"
                >
                  ✕ {t('close')}
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-2xl p-2">
                <img
                  src={previewImage}
                  alt="Proof"
                  className="max-h-[65vh] object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};