import React, { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  Users,
  Store,
  DollarSign,
  Gift,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user, isAmharic, t } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [payoutQueue, setPayoutQueue] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'payouts' | 'merchants'

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, queueRes, merchRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/payouts/admin/queue?status=PENDING'),
        api.get('/merchants'),
      ]);

      if (dashRes.data.success) {
        setMetrics(dashRes.data.metrics);
        setRecentTxns(dashRes.data.recentTransactions);
      }
      if (queueRes.data.success) {
        setPayoutQueue(queueRes.data.requests);
      }
      if (merchRes.data.success) {
        setMerchants(merchRes.data.merchants);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutDecision = async (id, decision) => {
    try {
      setActionLoading(true);
      const res = await api.put(`/payouts/admin/${id}/decide`, {
        decision,
        adminNote: decision === 'APPROVE' ? 'Approved & transferred via Telebirr' : 'Declined per policy',
      });
      if (res.data.success) {
        alert(res.data.message);
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deciding payout.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-600/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {t('adminTitle')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800">
                  {t('adminBadge')}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t('adminSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('adminTabOverview')}
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payouts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{t('adminTabPayouts')}</span>
            {payoutQueue.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-black">
                {payoutQueue.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'merchants'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('adminTabMerchants')} ({merchants.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>{t('adminGMV')}</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {metrics?.totalSalesVolumeETB?.toLocaleString() || '0'}{' '}
                  <span className="text-xs font-bold text-slate-500">{t('currency')}</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">
                  {isAmharic ? 'በአጋር የችርቻሮ መደብሮች የተሸጠ' : 'Processed at partner retail stores'}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>{t('adminPointsIssued')}</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-amber-600">
                  {metrics?.totalPointsIssued?.toLocaleString() || '0'}{' '}
                  <span className="text-xs font-bold text-slate-500">{t('pointsShort')}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  {t('adminPointsRedeemed')}: {metrics?.totalPointsRedeemed?.toLocaleString() || '0'} {t('pointsShort')}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>{t('adminCustomersCount')}</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {metrics?.totalCustomers || '0'}
                </div>
                <p className="text-[11px] text-blue-600 font-medium mt-1">
                  {isAmharic ? 'ንቁ ኢትዮጵያውያን ሸማቾች' : 'Active Ethiopian shoppers'}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                  <span>{t('adminPendingPayouts')}</span>
                  <Gift className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-purple-700">
                  {metrics?.pendingPayouts || '0'}
                </div>
                <p className="text-[11px] text-purple-600 font-medium mt-1">
                  {isAmharic ? 'የቴሌብር እና ኤርታይም ጥያቄዎች' : 'Telebirr & Airtime requests'}
                </p>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="font-extrabold text-base text-slate-900 mb-4">
                {isAmharic ? 'የቅርብ ጊዜ አጠቃላይ ግብይቶች' : 'Recent Network Transactions'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Txn #</th>
                      <th className="py-2.5 px-3">{isAmharic ? 'አይነት' : 'Type'}</th>
                      <th className="py-2.5 px-3">{isAmharic ? 'ደንበኛ' : 'Customer'}</th>
                      <th className="py-2.5 px-3">{isAmharic ? 'መደብር' : 'Merchant'}</th>
                      <th className="py-2.5 px-3">{t('billLabel')} ({t('currency')})</th>
                      <th className="py-2.5 px-3 text-right">{t('points')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTxns.map((tRow) => (
                      <tr key={tRow._id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">
                          {tRow.txnNumber}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              tRow.type === 'EARN'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {tRow.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {tRow.user?.name || 'Customer'}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {isAmharic && tRow.merchant?.tradeNameAmharic
                            ? tRow.merchant.tradeNameAmharic
                            : tRow.merchant?.name || 'Platform'}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800">
                          {tRow.billAmountETB > 0 ? `${tRow.billAmountETB} ${t('currency')}` : '—'}
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-black ${
                            tRow.pointsTransacted > 0 ? 'text-emerald-600' : 'text-slate-800'
                          }`}
                        >
                          {tRow.pointsTransacted > 0 ? '+' : ''}
                          {tRow.pointsTransacted} {t('pointsShort')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payout Queue Tab */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              {isAmharic ? 'የቴሌብር እና ኤርታይም ጥያቄዎች ዝርዝር' : 'Telebirr & Airtime Cashout Queue'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {isAmharic
                ? 'የሸማቾችን ነጥብ ወደ ገንዘብ የመቀየር ጥያቄዎችን ይገምግሙ እና ያጽድቁ።'
                : 'Review and approve points redemption requests from customers.'}
            </p>

            {payoutQueue.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                {t('adminAllPayoutsProcessed')}
              </div>
            ) : (
              <div className="space-y-4">
                {payoutQueue.map((req) => (
                  <div
                    key={req._id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-800">
                          {req.requestNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                          {req.payoutType}
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900 mt-1">
                        {req.amountETB} {t('currency')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isAmharic ? 'ደንበኛ፦ ' : 'Customer: '}<strong>{req.user?.name}</strong> •{' '}
                        {isAmharic ? 'ስልክ፦ ' : 'Phone: '}
                        <strong className="font-mono">{req.accountOrPhone}</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePayoutDecision(req._id, 'APPROVE')}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('adminApproveBtn')}</span>
                      </button>
                      <button
                        onClick={() => handlePayoutDecision(req._id, 'REJECT')}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('adminRejectBtn')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Merchants Tab */}
        {activeTab === 'merchants' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-4">
              {t('adminTabMerchants')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {merchants.map((m) => (
                <div
                  key={m._id}
                  className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={m.logo}
                      alt={m.name}
                      className="w-12 h-12 rounded-xl object-cover border"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {isAmharic && m.tradeNameAmharic ? m.tradeNameAmharic : m.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{m.category} • {m.city}</p>
                      <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        {m.cashbackRate}% {isAmharic ? 'የገንዘብ ተመላሽ' : 'Cashback Rate'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {t('verified')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
