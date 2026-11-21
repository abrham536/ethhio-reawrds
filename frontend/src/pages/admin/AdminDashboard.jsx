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
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  Filter,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user, isAmharic, t } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [payoutQueue, setPayoutQueue] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);

  // Deposit & Withdrawal Admin Queues
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [depositFilter, setDepositFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  const [withdrawalFilter, setWithdrawalFilter] = useState('PENDING');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('deposits'); // default to deposits to review new submissions!

  // Screenshot modal preview
  const [modalScreenshot, setModalScreenshot] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'deposits') {
      fetchAdminDeposits(depositFilter);
    } else if (activeTab === 'withdrawals') {
      fetchAdminWithdrawals(withdrawalFilter);
    }
  }, [activeTab, depositFilter, withdrawalFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, queueRes, merchRes, depRes, withRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/payouts/admin/queue?status=PENDING'),
        api.get('/merchants'),
        api.get('/finance/admin/deposits?status=PENDING'),
        api.get('/finance/admin/withdrawals?status=PENDING'),
      ]);

      if (dashRes.data?.success) {
        setMetrics(dashRes.data.metrics);
        setRecentTxns(dashRes.data.recentTransactions);
      }
      if (queueRes.data?.success) {
        setPayoutQueue(queueRes.data.requests);
      }
      if (merchRes.data?.success) {
        setMerchants(merchRes.data.merchants);
      }
      if (depRes.data?.success) {
        setDeposits(depRes.data.deposits);
      }
      if (withRes.data?.success) {
        setWithdrawals(withRes.data.withdrawals);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminDeposits = async (filter) => {
    try {
      const res = await api.get(`/finance/admin/deposits?status=${filter}`);
      if (res.data?.success) {
        setDeposits(res.data.deposits);
      }
    } catch (err) {
      console.error('Error loading deposits:', err);
    }
  };

  const fetchAdminWithdrawals = async (filter) => {
    try {
      const res = await api.get(`/finance/admin/withdrawals?status=${filter}`);
      if (res.data?.success) {
        setWithdrawals(res.data.withdrawals);
      }
    } catch (err) {
      console.error('Error loading withdrawals:', err);
    }
  };

  // Decide Deposit
  const handleDepositDecision = async (id, decision) => {
    let adminNote = '';
    if (decision === 'REJECT') {
      adminNote = window.prompt(
        isAmharic
          ? 'እባክዎ የማስገቢያ ጥያቄው ውድቅ የተደረገበትን ምክንያት ያስገቡ (ለምሳሌ፦ የውሸት ደረሰኝ ወይም ያልገባ ገንዘብ):'
          : 'Reason for rejecting deposit (e.g., Fake screenshot or unverified Txn ID):'
      );
      if (adminNote === null) return; // User cancelled
    }

    try {
      setActionLoading(true);
      const res = await api.put(`/finance/admin/deposits/${id}/decide`, {
        decision,
        adminNote: adminNote || (decision === 'APPROVE' ? 'Verified by Admin' : 'Rejected'),
      });

      if (res.data?.success) {
        alert(res.data.message);
        fetchAdminDeposits(depositFilter);
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deciding deposit.');
    } finally {
      setActionLoading(false);
    }
  };

  // Decide Withdrawal
  const handleWithdrawalDecision = async (id, decision) => {
    let payoutReceiptRef = '';
    let adminNote = '';

    if (decision === 'APPROVE') {
      payoutReceiptRef =
        window.prompt(
          isAmharic
            ? 'ገንዘቡን ያስተላለፉበትን የቴሌብር/የባንክ ደረሰኝ ቁጥር ያስገቡ (አስገዳጅ ያልሆነ ግን ይመከራል):'
            : 'Enter Telebirr/Bank confirmation reference number (optional):'
        ) || '';
    } else {
      adminNote = window.prompt(
        isAmharic
          ? 'ጥያቄውን ውድቅ ያደረጉበትን ምክንያት ያስገቡ (ገንዘቡ ወዲያውኑ ወደ ደንበኛው ቦርሳ ይመለሳል):'
          : 'Reason for rejection (funds will be refunded to customer wallet):'
      );
      if (adminNote === null) return;
    }

    try {
      setActionLoading(true);
      const res = await api.put(`/finance/admin/withdrawals/${id}/decide`, {
        decision,
        adminNote,
        payoutReceiptRef,
      });

      if (res.data?.success) {
        alert(res.data.message);
        fetchAdminWithdrawals(withdrawalFilter);
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deciding withdrawal.');
    } finally {
      setActionLoading(false);
    }
  };

  // Legacy points payout decision
  const handlePayoutDecision = async (id, decision) => {
    try {
      setActionLoading(true);
      const res = await api.put(`/payouts/admin/${id}/decide`, {
        decision,
        adminNote:
          decision === 'APPROVE' ? 'Approved & transferred via Telebirr' : 'Declined per policy',
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

  const pendingDepositsCount = deposits.filter((d) => d.status === 'PENDING').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'PENDING').length;

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
              <p className="text-xs text-slate-500">{t('adminSubtitle')}</p>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isAmharic ? 'አድስ' : 'Refresh'}</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'deposits'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t('adminDepositsTab')}</span>
            {pendingDepositsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] flex items-center justify-center font-black">
                {pendingDepositsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'withdrawals'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-300" />
            <span>{t('adminWithdrawalsTab')}</span>
            {pendingWithdrawalsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] flex items-center justify-center font-black">
                {pendingWithdrawalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('adminTabOverview')}
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'merchants'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t('adminTabMerchants')} ({merchants.length})
          </button>
        </div>

        {/* ================= TAB: DEPOSITS APPROVAL ================= */}
        {activeTab === 'deposits' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {t('modalProofTitle')} — {t('adminDepositsTab')}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAmharic
                    ? 'ደንበኞች ያስገቧቸውን የቴሌብር እና የባንክ ደረሰኞች ያረጋግጡ፤ ሲያጸድቁ ገንዘቡ ወዲያው ወደ ቦርሳቸው ይገባል።'
                    : 'Verify user deposit screenshots against bank/telebirr statement. Approving immediately credits wallet.'}
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setDepositFilter(f);
                      fetchAdminDeposits(f);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                      depositFilter === f
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'PENDING'
                      ? t('pending')
                      : f === 'APPROVED'
                      ? t('approved')
                      : f === 'REJECTED'
                      ? t('rejected')
                      : isAmharic
                      ? 'ሁሉም'
                      : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {deposits.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                {t('noPendingDeposits')}
              </div>
            ) : (
              <div className="space-y-4">
                {deposits.map((dep) => (
                  <div
                    key={dep._id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-5 text-xs hover:border-slate-300 transition-colors"
                  >
                    {/* Left: User & Request info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {dep.requestNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                          {dep.paymentMethod}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            dep.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : dep.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {dep.status}
                        </span>
                      </div>

                      <div className="text-base font-black text-emerald-700">
                        +{dep.amountETB.toLocaleString()} {t('currency')}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                        <p>
                          {isAmharic ? 'ደንበኛ፦' : 'User:'}{' '}
                          <strong className="text-slate-900">{dep.user?.name || 'Customer'}</strong>{' '}
                          ({dep.user?.phone})
                        </p>
                        <p>
                          {isAmharic ? 'የግብይት መለያ (Txn Ref)፦' : 'Txn Ref:'}{' '}
                          <strong className="font-mono text-slate-900 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                            {dep.transactionRef}
                          </strong>
                        </p>
                        <p className="text-slate-400">
                          {isAmharic ? 'የተጠየቀበት ቀን፦' : 'Submitted:'}{' '}
                          {new Date(dep.createdAt).toLocaleString()}
                        </p>
                        {dep.senderPhoneOrAccount && (
                          <p>
                            {isAmharic ? 'የላከበት ስልክ፦' : 'Sender Phone:'}{' '}
                            <span className="font-mono font-semibold">{dep.senderPhoneOrAccount}</span>
                          </p>
                        )}
                      </div>

                      {dep.adminNote && (
                        <p className="text-[11px] text-slate-500 italic">
                          <strong>Admin Note:</strong> {dep.adminNote}
                        </p>
                      )}
                    </div>

                    {/* Middle: Screenshot Thumbnail */}
                    <div className="flex items-center space-x-3">
                      {dep.screenshotUrl ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={dep.screenshotUrl}
                            alt="Receipt Proof"
                            onClick={() => setModalScreenshot(dep.screenshotUrl)}
                            className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-xs cursor-pointer hover:opacity-80 transition-opacity"
                          />
                          <button
                            onClick={() => setModalScreenshot(dep.screenshotUrl)}
                            className="mt-1 inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t('viewProofBtn')}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 text-center text-[10px] p-2">
                          {isAmharic ? 'ምስል የለም' : 'No Image'}
                        </div>
                      )}
                    </div>

                    {/* Right: Decision Buttons */}
                    {dep.status === 'PENDING' && (
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleDepositDecision(dep._id, 'APPROVE')}
                          disabled={actionLoading}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{t('approveDepositBtn')}</span>
                        </button>
                        <button
                          onClick={() => handleDepositDecision(dep._id, 'REJECT')}
                          disabled={actionLoading}
                          className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{t('rejectDepositBtn')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: WITHDRAWALS APPROVAL ================= */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {t('adminWithdrawalsTab')}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAmharic
                    ? 'የሸማቾችን የትርፍ እና የገንዘብ ተመላሽ ማውጫ ጥያቄዎችን ያጽድቁ። ውድቅ ከተደረገ ገንዘቡ ወዲያውኑ ወደ ደንበኛው ቦርሳ ይመለሳል።'
                    : 'Review and approve customer profit cashouts. If rejected, funds are automatically refunded to customer.'}
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setWithdrawalFilter(f);
                      fetchAdminWithdrawals(f);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                      withdrawalFilter === f
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'PENDING'
                      ? t('pending')
                      : f === 'APPROVED'
                      ? t('approved')
                      : f === 'REJECTED'
                      ? t('rejected')
                      : isAmharic
                      ? 'ሁሉም'
                      : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {withdrawals.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                {t('noPendingWithdrawals')}
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawals.map((w) => (
                  <div
                    key={w._id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-5 text-xs hover:border-slate-300 transition-colors"
                  >
                    {/* Details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-800 text-sm">
                          {w.requestNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                          {w.method}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            w.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {w.status}
                        </span>
                      </div>

                      <div className="text-base font-black text-blue-700">
                        {w.amountETB.toLocaleString()} {t('currency')}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                        <p>
                          {isAmharic ? 'ተጠቃሚ፦' : 'User:'}{' '}
                          <strong className="text-slate-900">{w.user?.name || 'Customer'}</strong>
                        </p>
                        <p>
                          {isAmharic ? 'የሚላክበት አካውንት፦' : 'Target Account:'}{' '}
                          <strong className="font-mono text-slate-900 bg-slate-200 px-1 py-0.5 rounded">
                            {w.accountNumber}
                          </strong>
                        </p>
                        <p>
                          {isAmharic ? 'የተቀባይ ሙሉ ስም፦' : 'Account Name:'}{' '}
                          <strong className="text-slate-800">{w.accountHolderName}</strong>
                        </p>
                        <p className="text-slate-400">
                          {isAmharic ? 'የተጠየቀበት ቀን፦' : 'Date:'}{' '}
                          {new Date(w.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {w.payoutReceiptRef && (
                        <p className="text-[11px] font-mono text-emerald-700 font-bold">
                          ✓ Payout Ref: {w.payoutReceiptRef}
                        </p>
                      )}
                      {w.adminNote && (
                        <p className="text-[11px] text-slate-500 italic">
                          <strong>Note:</strong> {w.adminNote}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {w.status === 'PENDING' && (
                      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        <button
                          onClick={() => handleWithdrawalDecision(w._id, 'APPROVE')}
                          disabled={actionLoading}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{t('approveWithdrawBtn')}</span>
                        </button>
                        <button
                          onClick={() => handleWithdrawalDecision(w._id, 'REJECT')}
                          disabled={actionLoading}
                          className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{t('rejectWithdrawBtn')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: OVERVIEW ================= */}
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
                  {t('adminPointsRedeemed')}:{' '}
                  {metrics?.totalPointsRedeemed?.toLocaleString() || '0'} {t('pointsShort')}
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
                  {(pendingDepositsCount + pendingWithdrawalsCount + payoutQueue.length).toLocaleString()}
                </div>
                <p className="text-[11px] text-purple-600 font-medium mt-1">
                  {isAmharic ? 'በመጠባበቅ ላይ ያሉ ጥያቄዎች' : 'Total Pending Actions'}
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
                      <th className="py-2.5 px-3">
                        {t('billLabel')} ({t('currency')})
                      </th>
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
                                : tRow.type === 'DEPOSIT'
                                ? 'bg-blue-100 text-blue-800'
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

        {/* ================= TAB: LEGACY PAYOUTS ================= */}
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
                        {isAmharic ? 'ደንበኛ፦ ' : 'Customer: '}
                        <strong>{req.user?.name}</strong> •{' '}
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

        {/* ================= TAB: MERCHANTS ================= */}
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
                      <p className="text-[11px] text-slate-500">
                        {m.category} • {m.city}
                      </p>
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

        {/* Modal: Large Proof Screenshot Preview */}
        {modalScreenshot && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-4 overflow-hidden shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-bold text-xs text-slate-800">{t('modalProofTitle')}</h4>
                <button
                  onClick={() => setModalScreenshot(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 font-bold text-xs"
                >
                  ✕ {t('close')}
                </button>
              </div>
              <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-900 rounded-2xl p-2">
                <img
                  src={modalScreenshot}
                  alt="Customer Payment Receipt Proof"
                  className="max-h-[70vh] object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};