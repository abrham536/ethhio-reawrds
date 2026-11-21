import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Gift,
  Smartphone,
  Tag,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const RedeemPage = () => {
  const { user, refreshUser, isAmharic, t } = useAuth();
  const [activeTab, setActiveTab] = useState('vouchers'); // 'vouchers' | 'payout' | 'my_vouchers'
  const [vouchers, setVouchers] = useState([]);
  const [myVouchers, setMyVouchers] = useState([]);
  const [myPayouts, setMyPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [message, setMessage] = useState(null);

  // Payout Form State
  const [payoutType, setPayoutType] = useState('TELEBIRR');
  const [accountOrPhone, setAccountOrPhone] = useState(user?.phone || '');
  const [pointsToRedeem, setPointsToRedeem] = useState(500);

  useEffect(() => {
    fetchCatalog();
    if (user) {
      fetchUserItems();
    }
  }, [user]);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vouchers');
      if (res.data.success) {
        setVouchers(res.data.vouchers);
      }
    } catch (err) {
      console.error('Error fetching vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      const [vRes, pRes] = await Promise.all([
        api.get('/vouchers/my-vouchers'),
        api.get('/payouts/my-requests'),
      ]);
      if (vRes.data.success) setMyVouchers(vRes.data.vouchers);
      if (pRes.data.success) setMyPayouts(pRes.data.requests);
    } catch (err) {
      console.error('Error fetching user vouchers/payouts:', err);
    }
  };

  const handleClaimVoucher = async (voucher) => {
    if ((user?.pointsBalance || 0) < voucher.pointsCost) {
      alert(
        isAmharic
          ? `በቂ ነጥብ የለዎትም! ${voucher.pointsCost} ነጥብ ያስፈልግዎታል።`
          : `Insufficient points! You need ${voucher.pointsCost} points.`
      );
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.post(`/vouchers/claim/${voucher._id}`);
      if (res.data.success) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        setMessage({
          type: 'success',
          text: isAmharic
            ? `ቫውቸሩ በተሳካ ሁኔታ ተገዝቷል! ኮድ፦ ${res.data.userVoucher.uniqueCode}`
            : `Voucher claimed successfully! Code: ${res.data.userVoucher.uniqueCode}`,
        });
        await refreshUser();
        await fetchUserItems();
        setActiveTab('my_vouchers');
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to claim voucher.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();
    if (!accountOrPhone) {
      alert(isAmharic ? 'እባክዎ የስልክ ወይም የሂሳብ ቁጥር ያስገቡ።' : 'Please provide phone or account number.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.post('/payouts/request', {
        payoutType,
        accountOrPhone,
        pointsToRedeem: Number(pointsToRedeem),
      });

      if (res.data.success) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        setMessage({
          type: 'success',
          text: res.data.message,
        });
        await refreshUser();
        await fetchUserItems();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit payout request.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const points = user?.pointsBalance || 0;
  const etbValue = (points * 0.1).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('redeemTitle')}
            </h1>
            <p className="text-xs text-slate-500">
              {t('redeemSubtitle')}
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-right">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              {t('availableBalance')}
            </span>
            <span className="text-lg font-black text-amber-900">
              {points.toLocaleString()} {t('pointsShort')}
            </span>
            <span className="text-xs text-emerald-700 font-semibold ml-1.5">
              ({etbValue} {t('currency')})
            </span>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-xs font-bold underline ml-3"
            >
              {t('dismiss')}
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'vouchers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>{t('tabVouchers')}</span>
          </button>

          <button
            onClick={() => setActiveTab('payout')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payout'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{t('tabPayout')}</span>
          </button>

          <button
            onClick={() => setActiveTab('my_vouchers')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my_vouchers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>
              {t('tabMyVouchers')} ({myVouchers.length})
            </span>
          </button>
        </div>

        {/* Tab 1: Vouchers Catalog */}
        {activeTab === 'vouchers' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map((voucher) => {
                const canAfford = points >= voucher.pointsCost;
                return (
                  <div
                    key={voucher._id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                          {voucher.discountAmountETB} {t('currency')} {t('voucherDiscount')}
                        </span>
                        <span className="text-xs font-black text-emerald-700">
                          {voucher.pointsCost} {t('pointsShort')}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {isAmharic && voucher.titleAmharic ? voucher.titleAmharic : voucher.title}
                      </h3>
                      {voucher.titleAmharic && !isAmharic && (
                        <p className="text-xs text-slate-500 mt-0.5">{voucher.titleAmharic}</p>
                      )}

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {voucher.description}
                      </p>

                      {voucher.merchant && (
                        <div className="mt-3 text-[11px] text-slate-500 font-medium">
                          {t('validAt')}{' '}
                          <span className="font-bold text-slate-800">
                            {isAmharic && voucher.merchant.tradeNameAmharic
                              ? voucher.merchant.tradeNameAmharic
                              : voucher.merchant.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleClaimVoucher(voucher)}
                        disabled={!canAfford || actionLoading}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                          canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {canAfford
                            ? `${voucher.pointsCost} ${t('pointsShort')} - ${t('claimVoucherBtn')}`
                            : `${t('needMorePoints')} (+${voucher.pointsCost - points})`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Telebirr & Airtime Cashout Form */}
        {activeTab === 'payout' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {t('tabPayout')}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {isAmharic
                  ? 'ነጥቦችዎን በቀጥታ ወደ ስልክዎ ገንዘብ ይቀይሩ (10 ነጥብ = 1 ብር)።'
                  : 'Exchange points directly into your phone account (10 Points = 1 ETB).'}
              </p>

              <form onSubmit={handlePayoutSubmit} className="space-y-4">
                {/* Method selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    {t('payoutDestination')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'TELEBIRR', label: 'ቴሌብር (Telebirr)', badge: 'ተወዳጅ' },
                      { id: 'ETHIO_TELECOM_AIRTIME', label: 'ኤርታይም (Airtime)', badge: 'ፈጣን' },
                      { id: 'CBE_BIRR', label: 'ሲቢኢ ብር (CBE Birr)', badge: 'ባንክ' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setPayoutType(item.id)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          payoutType === item.id
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className="block text-xs">{item.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Points Amount Slider / Presets */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>{t('pointsToCashOut')}</span>
                    <span className="text-emerald-700 text-sm">
                      {pointsToRedeem} {t('pointsShort')} = {(pointsToRedeem * 0.1).toFixed(2)} {t('currency')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {[200, 500, 1000, 2000].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setPointsToRedeem(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                          pointsToRedeem === preset
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset} {t('pointsShort')} ({preset * 0.1} {t('currency')})
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="50"
                    max={Math.max(500, points)}
                    step="50"
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                    className="w-full mt-3 accent-emerald-600"
                  />
                </div>

                {/* Account / Phone input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('accountNumberLabel')}
                  </label>
                  <input
                    type="text"
                    value={accountOrPhone}
                    onChange={(e) => setAccountOrPhone(e.target.value)}
                    placeholder="+251911223344"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading || points < pointsToRedeem}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {t('btnSubmitPayout')} ({(pointsToRedeem * 0.1).toFixed(2)} {t('currency')})
                  </span>
                </button>
              </form>
            </div>

            {/* Payout History Side panel */}
            <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 mb-3">
                {t('payoutHistoryTitle')}
              </h4>
              {myPayouts.length === 0 ? (
                <p className="text-xs text-slate-400">{t('noPayouts')}</p>
              ) : (
                <div className="space-y-3">
                  {myPayouts.map((req) => (
                    <div
                      key={req._id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {req.amountETB} {t('currency')} via {req.payoutType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {req.accountOrPhone} • {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status === 'APPROVED'
                          ? t('approved')
                          : req.status === 'REJECTED'
                          ? t('rejected')
                          : t('pending')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: My Claimed Vouchers */}
        {activeTab === 'my_vouchers' && (
          <div>
            {myVouchers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
                <Gift className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">{t('noClaimedVouchers')}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {isAmharic
                    ? 'የሱቅ ቫውቸሮችን በነጥብዎ በመግዛት በቼክአውት ወቅት ፈጣን ቅናሽ ያግኙ።'
                    : 'Browse store vouchers and redeem with your loyalty points to unlock instant checkout discounts.'}
                </p>
                <button
                  onClick={() => setActiveTab('vouchers')}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  {t('browseVouchersBtn')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myVouchers.map((uv) => (
                  <div
                    key={uv._id}
                    className="bg-white rounded-3xl border-2 border-emerald-500/30 p-5 shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-700">
                        {isAmharic && uv.voucher?.merchant?.tradeNameAmharic
                          ? uv.voucher.merchant.tradeNameAmharic
                          : uv.voucher?.merchant?.name || 'Partner Voucher'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          uv.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {uv.status === 'ACTIVE'
                          ? t('active')
                          : uv.status === 'REDEEMED'
                          ? t('redeemed')
                          : t('expired')}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base">
                      {uv.discountAmountETB} {t('currency')} {t('voucherDiscount')}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isAmharic && uv.voucher?.titleAmharic
                        ? uv.voucher.titleAmharic
                        : uv.voucher?.title || 'Store Discount'}
                    </p>

                    {/* Voucher Code Box */}
                    <div className="my-4 p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between font-mono font-bold tracking-widest text-sm">
                      <span>{uv.uniqueCode}</span>
                      <button
                        onClick={() => copyToClipboard(uv.uniqueCode)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title={t('copy')}
                      >
                        {copiedCode === uv.uniqueCode ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span>{new Date(uv.expiresAt).toLocaleDateString()}</span>
                      <span className="text-slate-600 font-semibold">{t('showToCashier')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
