import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Receipt,
  Search,
  UserCheck,
  Sparkles,
  CreditCard,
  QrCode,
  Tag,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Store,
  DollarSign,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const POSPage = () => {
  const { user, isAmharic, t } = useAuth();
  const [activeTab, setActiveTab] = useState('award'); // 'award' | 'redeem_voucher'

  // Award Points State
  const [customerIdentifier, setCustomerIdentifier] = useState('0911333333');
  const [billAmount, setBillAmount] = useState('650');
  const [receiptNumber, setReceiptNumber] = useState('REC-8841');
  const [customerData, setCustomerData] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [awardLoading, setAwardLoading] = useState(false);
  const [receiptModal, setReceiptModal] = useState(null);

  // Voucher Redeem State
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [voucherBillAmount, setVoucherBillAmount] = useState('');
  const [voucherResult, setVoucherResult] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Shift summary
  const [dailySummary, setDailySummary] = useState(null);

  useEffect(() => {
    fetchDailySummary();
    handleCustomerLookup('0911333333');
  }, []);

  const fetchDailySummary = async () => {
    try {
      const res = await api.get('/pos/daily-summary');
      if (res.data.success) {
        setDailySummary(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch daily summary:', err);
    }
  };

  const handleCustomerLookup = async (idToSearch) => {
    const query = idToSearch || customerIdentifier;
    if (!query) return;

    try {
      setLookupLoading(true);
      const res = await api.get(`/pos/customer-lookup/${encodeURIComponent(query.trim())}`);
      if (res.data.success) {
        setCustomerData(res.data);
      }
    } catch (err) {
      setCustomerData(null);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleAwardPoints = async (e) => {
    e.preventDefault();
    if (!billAmount || Number(billAmount) <= 0) {
      alert(isAmharic ? 'እባክዎ ትክክለኛ የብር ሂሳብ መጠን ያስገቡ።' : 'Please enter a valid bill amount in ETB.');
      return;
    }

    try {
      setAwardLoading(true);
      const res = await api.post('/pos/award-points', {
        customerIdentifier: customerIdentifier.trim(),
        billAmountETB: Number(billAmount),
        receiptNumber: receiptNumber.trim(),
      });

      if (res.data.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setReceiptModal(res.data.receipt);
        fetchDailySummary();
        handleCustomerLookup();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error awarding points.');
    } finally {
      setAwardLoading(false);
    }
  };

  const handleRedeemVoucher = async (e) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;

    try {
      setVoucherLoading(true);
      const res = await api.post('/pos/redeem-voucher', {
        voucherCode: voucherCodeInput.trim(),
        billAmountETB: Number(voucherBillAmount || 0),
      });

      if (res.data.success) {
        confetti({ particleCount: 70, spread: 70 });
        setVoucherResult(res.data);
        fetchDailySummary();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error redeeming voucher.');
    } finally {
      setVoucherLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/20">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {t('posTitle')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {t('posOnline')}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t('posLoggedInAs')} <strong>{user?.name}</strong> •{' '}
                <span className="text-emerald-700 font-semibold">
                  {isAmharic && user?.merchant?.tradeNameAmharic
                    ? user.merchant.tradeNameAmharic
                    : user?.merchant?.name || "Kaldi's Coffee Bole"}
                </span>
              </p>
            </div>
          </div>

          {/* Shift Stats Bar */}
          {dailySummary && (
            <div className="flex items-center space-x-4 text-xs bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">{t('posShiftSales')}</span>
                <span className="font-bold text-slate-900">
                  {dailySummary.summary.totalSalesVolumeETB.toLocaleString()} {t('currency')}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">{t('posPointsIssued')}</span>
                <span className="font-bold text-amber-600">
                  {dailySummary.summary.totalPointsAwarded.toLocaleString()} {t('pointsShort')}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">{t('posVouchersRedeemed')}</span>
                <span className="font-bold text-emerald-600">
                  {dailySummary.summary.totalVouchersRedeemed}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('award')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'award'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('posTabAward')}
          </button>
          <button
            onClick={() => setActiveTab('redeem_voucher')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'redeem_voucher'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('posTabRedeem')}
          </button>
        </div>

        {/* Main Work Area */}
        {activeTab === 'award' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Cashier Bill Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-extrabold text-slate-900 mb-1">
                {t('posStep1')}
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                {t('posStep1Desc')}
              </p>

              <form onSubmit={handleAwardPoints} className="space-y-4">
                {/* Customer Identifier Lookup */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('posCustomerInputLabel')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customerIdentifier}
                      onChange={(e) => setCustomerIdentifier(e.target.value)}
                      placeholder="e.g. 0911333333 or ETR-984210"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-amber-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleCustomerLookup()}
                      disabled={lookupLoading}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                    >
                      {lookupLoading ? '...' : t('posLookupBtn')}
                    </button>
                  </div>
                </div>

                {/* Bill Amount in ETB */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('posBillLabel')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                      {t('currencyCode')}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 text-lg font-black text-slate-900 focus:outline-hidden focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Receipt reference number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('posReceiptNumberLabel')}
                  </label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="e.g. REC-9081"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                {/* Live Cashback & Points Calculation Box */}
                {billAmount && Number(billAmount) > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                    <div className="flex items-center justify-between text-amber-900 font-bold mb-1">
                      <span>{isAmharic ? 'የሚሰላ የገንዘብ ተመላሽ፦' : 'Calculated Cashback:'}</span>
                      <span>
                        {(Number(billAmount) * 0.06 * (customerData?.customer?.tierMultiplier || 1)).toFixed(2)} {t('currency')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-800 font-black text-sm">
                      <span>{isAmharic ? 'የሚሰጡ ነጥቦች፦' : 'Points to be Awarded:'}</span>
                      <span>
                        +
                        {Math.round(
                          Number(billAmount) * 0.06 * (customerData?.customer?.tierMultiplier || 1) * 10
                        )}{' '}
                        {t('pointsShort')}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-700 mt-1">
                      *{isAmharic ? 'የመደብሩን 6% ተመላሽ እና ' : 'Includes 6% cashback + '}
                      {customerData?.customer?.tierMultiplier || 1}x{' '}
                      {customerData?.customer?.tier || 'Bronze'} {t('tierPerk')}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={awardLoading || !customerData}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {awardLoading ? '...' : t('posAwardBtn')}
                </button>
              </form>
            </div>

            {/* Right 5 cols: Live Customer Snapshot */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
                <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('posCustomerPreview')}</span>
                </h3>

                {customerData?.customer ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-900 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-emerald-400">{t('posVerifiedMember')}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                          {customerData.customer.tier}
                        </span>
                      </div>
                      <h4 className="text-lg font-extrabold">{customerData.customer.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{customerData.customer.phone}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {t('memberId')}: {customerData.customer.memberCode}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase">{t('availableBalance')}</span>
                          <p className="text-base font-black text-amber-400">
                            {customerData.customer.pointsBalance.toLocaleString()} {t('pointsShort')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase">{t('tierPerk')}</span>
                          <p className="text-base font-bold text-emerald-400">
                            {customerData.customer.tierMultiplier}x
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer active vouchers list */}
                    {customerData.availableVouchers?.length > 0 && (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                        <span className="font-bold text-emerald-900 block mb-1">
                          {t('posAvailableVouchers')} ({customerData.availableVouchers.length}):
                        </span>
                        {customerData.availableVouchers.map((uv) => (
                          <div
                            key={uv._id}
                            className="flex items-center justify-between py-1 text-[11px] text-emerald-800"
                          >
                            <span>
                              {isAmharic && uv.voucher?.titleAmharic
                                ? uv.voucher.titleAmharic
                                : uv.voucher?.title}
                            </span>
                            <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-sm border border-emerald-200">
                              {uv.uniqueCode}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    {t('posEnterPhoneHint')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Redeem Customer Voucher Form */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">
              {t('posTabRedeem')}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {isAmharic
                ? 'የደንበኛውን የቫውቸር ኮድ በማስገባት ፈጣን የዋጋ ቅናሽ ያድርጉ።'
                : 'Enter customer unique voucher code to apply instant bill discount.'}
            </p>

            <form onSubmit={handleRedeemVoucher} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('posVoucherCodeLabel')}
                </label>
                <input
                  type="text"
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  placeholder="KLD-XXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base font-mono font-bold tracking-widest text-slate-900 focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('posBillLabel')}
                </label>
                <input
                  type="number"
                  value={voucherBillAmount}
                  onChange={(e) => setVoucherBillAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={voucherLoading}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                {voucherLoading ? '...' : t('posVerifyVoucherBtn')}
              </button>
            </form>

            {voucherResult && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{voucherResult.message}</span>
                </div>
                <div className="mt-2 text-slate-700 space-y-1">
                  <p>Customer: <strong>{voucherResult.redemption.customerName}</strong></p>
                  <p>
                    Discount Applied:{' '}
                    <strong className="text-emerald-700 text-sm">
                      -{voucherResult.redemption.discountAmountETB} {t('currency')}
                    </strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-slate-900">
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-2xl">🎉</span>
              <h3 className="font-black text-lg mt-1 tracking-tight">{t('posReceiptTitle')}</h3>
              <p className="text-xs text-slate-500">{receiptModal.merchantName}</p>
            </div>

            <div className="my-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>{isAmharic ? 'የደረሰኝ ቁጥር፦' : 'Receipt Number:'}</span>
                <span className="font-bold text-slate-800">{receiptModal.txnNumber}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{isAmharic ? 'ደንበኛ፦' : 'Customer:'}</span>
                <span className="font-bold text-slate-800">{receiptModal.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{isAmharic ? 'የሂሳብ መጠን፦' : 'Bill Amount:'}</span>
                <span className="font-bold text-slate-800">{receiptModal.billAmountETB} {t('currency')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold border-t border-dashed border-slate-200 pt-2 text-sm">
                <span>{isAmharic ? 'የተሰጠ ነጥብ፦' : 'Points Awarded:'}</span>
                <span>+{receiptModal.pointsAwarded} {t('pointsShort')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t('cashValue')}:</span>
                <span>+{receiptModal.cashbackEarnedETB} {t('currency')}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200">
                <span>{isAmharic ? 'አዲሱ ሂሳብ፦' : 'New Balance:'}</span>
                <span className="text-amber-600 font-black">
                  {receiptModal.newPointsBalance.toLocaleString()} {t('pointsShort')} ({receiptModal.newETBEquivalent} {t('currency')})
                </span>
              </div>
            </div>

            <button
              onClick={() => setReceiptModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              {t('posDoneBtn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
