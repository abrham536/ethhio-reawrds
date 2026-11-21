import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, FileText, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const OrdersPage = () => {
  const { user, isAmharic } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'IN_GAINS' | 'FINISHED'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/invest/my-orders?status=${activeTab}`);
      if (res.data?.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 pb-28 pt-3 px-3 sm:px-5 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-black tracking-wide text-white">
          {isAmharic ? 'የኢንቨስትመንት ትዕዛዞች' : 'Orders'}
        </h1>

        <button
          onClick={fetchOrders}
          className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-all"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* 3 Tabs: [ All ] [ In Gains ] [ Finished ] */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 mb-4 text-center">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isAmharic ? 'ሁሉም' : 'All'}
        </button>

        <button
          onClick={() => setActiveTab('IN_GAINS')}
          className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'IN_GAINS'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isAmharic ? 'በትርፍ ላይ' : 'In Gains'}
        </button>

        <button
          onClick={() => setActiveTab('FINISHED')}
          className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
            activeTab === 'FINISHED'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isAmharic ? 'የተጠናቀቁ' : 'Finished'}
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">{isAmharic ? 'ትዕዛዞች በመጫን ላይ...' : 'Loading orders...'}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto text-2xl">
            📋
          </div>
          <p className="text-xs text-slate-400">
            {isAmharic ? 'ምንም የኢንቨስትመንት ትዕዛዝ የለም' : 'No investment orders found'}
          </p>
          <button
            onClick={() => navigate('/invest')}
            className="py-2.5 px-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30"
          >
            {isAmharic ? 'ኢንቨስት ማድረግ ጀምር' : 'Explore Investments'}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl bg-[#0f172a] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {order.orderNumber}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white mt-0.5">
                    {order.productName}
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    order.status === 'IN_GAINS'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {order.status === 'IN_GAINS'
                    ? (isAmharic ? 'በትርፍ ላይ' : 'In Gains')
                    : (isAmharic ? 'የተጠናቀቀ' : 'Finished')}
                </span>
              </div>

              {/* Stats 2x2 */}
              <div className="grid grid-cols-2 gap-3 text-xs py-1">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    INVESTED PRICE
                  </span>
                  <span className="text-sm font-black text-amber-400">
                    Br{order.price?.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    DAILY RETURN
                  </span>
                  <span className="text-sm font-black text-emerald-400">
                    Br{order.dailyEarnings?.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    TOTAL ESTIMATED
                  </span>
                  <span className="text-sm font-black text-white">
                    Br{order.totalIncome?.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    EARNED SO FAR
                  </span>
                  <span className="text-sm font-black text-emerald-400">
                    Br{order.earnedSoFar?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>{isAmharic ? 'የቆይታ ጊዜ' : 'Progress'}</span>
                  <span>{order.daysElapsed || 1} / {order.days || 49} {isAmharic ? 'ቀናት' : 'days'}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (((order.daysElapsed || 1) / (order.days || 49)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
