import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Gift,
  Clock,
  Filter,
  CheckCircle,
  QrCode,
  Award,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { DigitalCardModal } from '../../components/DigitalCardModal';

export const WalletPage = () => {
  const { user, isAmharic, t } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [filterType]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType !== 'ALL') params.type = filterType;
      const res = await api.get('/admin/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const points = user?.pointsBalance || 0;
  const etbValue = (points * 0.1).toFixed(2);
  const tier = user?.tier || 'Bronze';

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('walletTitle')}
            </h1>
            <p className="text-xs text-slate-500">
              {t('walletSubtitle')}
            </p>
          </div>
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>{t('btnShowPass')}</span>
          </button>
        </div>

        {/* Balance Card & Tier Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Balance Card */}
          <div className="md:col-span-2 rounded-3xl p-6 bg-gradient-to-br from-emerald-800 via-emerald-700 to-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
                  {t('availableBalance')}
                </span>
                <h2 className="text-4xl font-black text-amber-300 mt-1">
                  {points.toLocaleString()} <span className="text-xl text-white">{t('pointsShort')}</span>
                </h2>
                <p className="text-xs text-emerald-200 mt-1">
                  ≈ <strong>{etbValue} {t('currency')}</strong> {t('cashValue')}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                {tier} {t('tierLevel')}
              </span>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">
                  {t('lifetimeEarned')}
                </span>
                <span className="font-bold text-slate-100">
                  {(user?.lifetimeEarnedPoints || points).toLocaleString()} {t('pointsShort')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block uppercase">
                  {t('memberId')}
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {user?.memberCode || 'ETR-DEMO'}
                </span>
              </div>
            </div>
          </div>

          {/* Tier Benefits Perk Card */}
          <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-amber-500 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  {t('tierPerk')}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{tier} Level</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {tier === 'Platinum'
                  ? isAmharic
                    ? 'በሁሉም ግብይቶችዎ ላይ ከፍተኛውን 1.5x የነጥብ ማባዣ እና ፈጣን የቴሌብር ክፍያ ያገኛሉ።'
                    : 'Enjoy maximum 1.5x points boost on all shopping + priority payouts.'
                  : tier === 'Gold'
                  ? isAmharic
                    ? 'በአጋር መደብሮች ሲገዙ 1.25x የነጥብ ጉርሻ ማባዣ ይጠቀሙ።'
                    : 'Enjoy 1.25x points multiplier on every purchase at partner stores.'
                  : isAmharic
                    ? 'ተጨማሪ ነጥቦችን በመሰብሰብ ወደ ወርቅ ደረጃ ከፍ ይበሉ!'
                    : 'Earn points and level up to Gold for higher cashback rewards.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href="/redeem"
                className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Gift className="w-4 h-4 text-amber-600" />
                <span>{t('navRedeem')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t('activityLedger')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('activitySubtitle')}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              {[
                { id: 'ALL', label: t('filterAll') },
                { id: 'EARN', label: t('filterEarned') },
                { id: 'REDEEM_VOUCHER', label: t('filterVouchers') },
                { id: 'REDEEM_TELEBIRR', label: t('filterPayouts') },
                { id: 'WELCOME_BONUS', label: t('filterBonus') },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilterType(item.id)}
                  className={`px-3 py-1.5 rounded-xl shrink-0 transition-all ${
                    filterType === item.id
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              {t('noActivity')}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((txn) => {
                const isEarn = txn.pointsTransacted > 0;
                return (
                  <div
                    key={txn._id}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          isEarn
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isEarn ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">
                          {txn.description}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                          {txn.merchant?.name && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-slate-600">
                                {txn.merchant.name}
                              </span>
                            </>
                          )}
                          {txn.billAmountETB > 0 && (
                            <>
                              <span>•</span>
                              <span>{t('billLabel')}: {txn.billAmountETB} {t('currency')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-black text-sm ${
                          isEarn ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {isEarn ? '+' : ''}
                        {txn.pointsTransacted.toLocaleString()} {t('pointsShort')}
                      </span>
                      {txn.cashbackEquivalentETB > 0 && (
                        <p className="text-[10px] text-slate-400 font-medium">
                          {txn.cashbackEquivalentETB} {t('currency')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DigitalCardModal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} />
    </div>
  );
};
