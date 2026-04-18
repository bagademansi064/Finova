"use client"

import React, { useEffect, useState } from 'react';
import { useStockDetail } from '@/lib/context/StockDetailContext';
import { apiFetch } from '@/lib/api';
import { 
  X, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  PieChart, 
  Bell, 
  FileText, 
  Zap,
  ChevronRight,
  Loader2,
  Users
} from 'lucide-react';

interface StockData {
  symbol: string;
  current_price: number;
  percent_change: number;
  previous_close: number;
  open_price: number;
  day_high: number;
  day_low: number;
  volume: number;
  avg_price: number;
  last_qty: number;
  ltq_time: string;
  market_cap: number;
  sector: string;
  industry: string;
  market_depth: {
    bids: { price: number; orders: number; quantity: number }[];
    offers: { price: number; orders: number; quantity: number }[];
    total_bid_qty: number;
    total_offer_qty: number;
  };
}

interface Group {
  id: string;
  finova_id: string;
  name: string;
}

export default function StockDetailDrawer() {
  const { isOpen, symbol, closeStockDetail } = useStockDetail();
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchType, setPitchType] = useState<'buy' | 'sell'>('buy');
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [pitching, setPitching] = useState(false);
  const [pitchReason, setPitchReason] = useState("");

  useEffect(() => {
    if (isOpen && symbol) {
      fetchStockData(symbol);
      fetchUserGroups();
    }
  }, [isOpen, symbol]);

  const fetchStockData = async (sym: string) => {
    setLoading(true);
    try {
      const resp = await apiFetch(`/market/live/?symbols=${sym}`);
      if (resp.ok) {
        const result = await resp.json();
        // The API returns an object keyed by symbol
        const stockInfo = result[sym];
        setData(stockInfo);
      }
    } catch (err) {
      console.error("Failed to fetch stock data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const resp = await apiFetch('/groups/');
      if (resp.ok) {
        const result = await resp.json();
        setUserGroups(result.results || []);
      }
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  const handlePitch = async () => {
    if (!selectedGroup || !symbol) return;
    setPitching(true);
    try {
      const resp = await apiFetch(`/groups/${selectedGroup}/discussions/`, {
        method: 'POST',
        body: JSON.stringify({
          stock_symbol: symbol,
          discussion_type: pitchType,
          reasoning: pitchReason || `Pitching ${symbol} to the group for a ${pitchType} trade.`,
          required_capital: 10000, // Default for now
        })
      });
      if (resp.ok) {
        alert(`Successfully pitched ${symbol} to group!`);
        setShowPitchModal(false);
        setPitchReason("");
      } else {
        const error = await resp.json();
        alert(error.detail || "Failed to pitch");
      }
    } catch (err) {
      alert("Network error while pitching");
    } finally {
      setPitching(false);
    }
  };

  if (!isOpen && !data) return null;

  return (
    <>
      {/* Backdrop (Top 40% Blur) */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-x-0 top-0 h-[40%] backdrop-blur-md bg-black/5"
          onClick={closeStockDetail}
        />
        
        {/* Drawer Wrapper */}
        <div 
          className={`absolute inset-x-0 bottom-0 h-[65%] bg-white rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out transform flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          {/* Pull Indicator */}
          <div className="w-full flex justify-center pt-3 pb-1" onClick={closeStockDetail}>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Fixed Header */}
          <div className="px-6 pb-4 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-[2.5rem]">
            <button onClick={closeStockDetail} className="p-2 -ml-2 text-gray-400">
               <X size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Market Insights</h2>
            <div className="w-10" /> {/* Spacer */}
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-12 hide-scrollbar">
            {loading || !data ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="animate-spin text-[#0D624B] mb-4" size={40} />
                <p className="text-gray-400 font-medium">Fetching real-time data...</p>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                {/* Stock Identification */}
                <div className="flex justify-between items-end mb-8 mt-2">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.symbol.split('.')[0]}</h1>
                    <div className="flex gap-2">
                      <span className="px-1.5 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded border border-gray-200">NSE</span>
                      <span className="text-xs text-gray-500 font-medium">{data.symbol}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">₹{parseFloat(data.current_price.toString()).toLocaleString('en-IN')}</div>
                    <div className={`flex items-center justify-end text-sm font-semibold ${data.percent_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.percent_change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                      {Math.abs(data.percent_change).toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Exchange Selectors */}
                <div className="flex gap-2 mb-8">
                  <button className="px-5 py-1.5 bg-gray-50 text-gray-600 font-semibold rounded-full text-xs border border-gray-200 shadow-sm">NSE</button>
                  <button className="px-5 py-1.5 text-gray-400 font-semibold rounded-full text-xs hover:bg-gray-50">BSE</button>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={() => { setPitchType('buy'); setShowPitchModal(true); }}
                    className="flex flex-col items-center justify-center bg-[#0D624B] text-white py-3 rounded-2xl shadow-lg shadow-[#0D624B]/20 active:scale-95 transition-transform"
                  >
                    <span className="text-[10px] opacity-70 font-medium uppercase tracking-wider mb-0.5">Sentiment</span>
                    <span className="text-base font-bold">Vote for Buy</span>
                  </button>
                  <button 
                    onClick={() => { setPitchType('sell'); setShowPitchModal(true); }}
                    className="flex flex-col items-center justify-center bg-[#e53935] text-white py-3 rounded-2xl shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                  >
                    <span className="text-[10px] opacity-70 font-medium uppercase tracking-wider mb-0.5">Sentiment</span>
                    <span className="text-base font-bold">Vote for Sell</span>
                  </button>
                </div>

                {/* Utility Shortcuts */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 border border-gray-100">
                    <TrendingUp size={18} /> View chart
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 border border-gray-100">
                    <Activity size={18} /> Option chain
                  </button>
                </div>

                {/* Market Depth */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-800">Market Depth</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Real-time</span>
                  </div>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-2 text-[10px] font-bold text-gray-400 border-b border-gray-100 bg-gray-50">
                      <div className="grid grid-cols-3 p-2 text-center">
                        <span>BID</span><span>ORDERS</span><span>QTY</span>
                      </div>
                      <div className="grid grid-cols-3 p-2 text-center border-l border-gray-100">
                        <span>OFFER</span><span>ORDERS</span><span>QTY</span>
                      </div>
                    </div>
                    {data.market_depth?.bids.map((bid, i) => (
                      <div key={i} className="grid grid-cols-2 text-[11px]">
                        <div className="grid grid-cols-3 p-2 bg-white text-center">
                          <span className="text-blue-500 font-bold">{bid.price.toFixed(2)}</span>
                          <span className="text-gray-500">{bid.orders}</span>
                          <span className="text-gray-900 font-medium">{bid.quantity.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-3 p-2 bg-white text-center border-l border-gray-100">
                          <span className="text-red-500 font-bold">{data.market_depth.offers[i].price.toFixed(2)}</span>
                          <span className="text-gray-500">{data.market_depth.offers[i].orders}</span>
                          <span className="text-gray-900 font-medium">{data.market_depth.offers[i].quantity.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-2 text-[10px] font-bold bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between p-2 text-gray-500">
                        <span>TOTAL</span>
                        <span>{data.market_depth?.total_bid_qty.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 text-gray-500 border-l border-gray-100">
                        <span>TOTAL</span>
                        <span>{data.market_depth?.total_offer_qty.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day Performance */}
                <div className="mb-10">
                  <div className="flex justify-between mb-4">
                     <h3 className="text-sm font-bold text-gray-800">Day's Performance</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-2 uppercase">
                        <span>Low</span><span>High</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span>{data.day_low}</span><span>{data.day_high}</span>
                      </div>
                      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        {/* Calculate marker position */}
                        {(() => {
                           const low = parseFloat(data.day_low.toString());
                           const high = parseFloat(data.day_high.toString());
                           const current = parseFloat(data.current_price.toString());
                           const percent = Math.max(0, Math.min(100, ((current - low) / (high - low)) * 100));
                           return (
                             <div 
                               className="absolute top-0 bottom-0 bg-[#0D624B]" 
                               style={{ left: `${Math.max(0, percent - 10)}%`, width: '20%' }}
                             />
                           )
                        })()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="flex justify-between border-b border-gray-100 pb-2">
                         <span className="text-xs text-gray-400 font-medium">OPEN</span>
                         <span className="text-sm font-bold text-gray-800">{data.open_price}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-100 pb-2">
                         <span className="text-xs text-gray-400 font-medium">PREV. CLOSE</span>
                         <span className="text-sm font-bold text-gray-800">{data.previous_close}</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-12">
                   {[
                     { label: 'VOLUME', value: (data.volume / 1000000).toFixed(1) + 'M' },
                     { label: 'AVG. PRICE', value: data.current_price },
                     { label: 'LAST QTY', value: data.last_qty },
                     { label: 'LTQ TIME', value: data.ltq_time }
                   ].map((stat, i) => (
                     <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                       <div className="text-[10px] font-bold text-gray-400 mb-1">{stat.label}</div>
                       <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                     </div>
                   ))}
                </div>

                {/* Quick Actions List */}
                <div className="bg-gray-50 rounded-3xl overflow-hidden mb-12 border border-gray-100">
                  <button className="w-full flex items-center justify-between p-5 hover:bg-gray-100 transition-colors border-b border-white">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><Bell size={20} className="text-[#0D624B]" /></div>
                      <span className="text-[15px] font-bold text-gray-700">Set alert</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-5 hover:bg-gray-100 transition-colors border-b border-white">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><FileText size={20} className="text-[#0D624B]" /></div>
                      <span className="text-[15px] font-bold text-gray-700">Add notes</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-5 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><Zap size={20} className="text-[#0D624B]" /></div>
                      <span className="text-[15px] font-bold text-gray-700">Create GTT</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                </div>

                {/* In-Depth Analysis */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-800">In-depth Analysis</h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-5 bg-orange-50/30 rounded-3xl border border-orange-100 group">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-white rounded-xl"><BarChart3 size={20} className="text-[#0D624B]" /></div>
                         <div className="text-left">
                           <div className="text-[15px] font-bold text-gray-800">Fundamentals</div>
                           <div className="text-xs text-gray-400 font-medium">P/E Ratio, Market Cap, EPS</div>
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full flex items-center justify-between p-5 bg-orange-50/30 rounded-3xl border border-orange-100 group">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-white rounded-xl"><PieChart size={20} className="text-[#0D624B]" /></div>
                         <div className="text-left">
                           <div className="text-[15px] font-bold text-gray-800">Technicals</div>
                           <div className="text-xs text-gray-400 font-medium">RSI, MACD, Moving Averages</div>
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pitch to Group Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPitchModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl animate-context-menu-in">
             <div className="flex items-center gap-3 mb-6">
               <div className={`p-3 rounded-2xl ${pitchType === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 <Users size={24} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-800">Pitch to Group</h3>
                 <p className="text-xs text-gray-400 font-medium">Propose a {pitchType} to your club</p>
               </div>
             </div>

             <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Select Group</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto px-1 hide-scrollbar">
                    {userGroups.length === 0 ? (
                       <div className="text-center py-4 text-xs text-gray-400">No active groups found</div>
                    ) : (
                      userGroups.map(group => (
                        <button 
                          key={group.id}
                          onClick={() => setSelectedGroup(group.finova_id)}
                          className={`w-full flex justify-between items-center p-4 rounded-2xl text-sm font-bold border transition-all ${selectedGroup === group.finova_id ? 'border-[#0D624B] bg-[#0D624B]/5 text-[#0D624B]' : 'border-gray-100 text-gray-600'}`}
                        >
                          {group.name}
                          {selectedGroup === group.finova_id && <Zap size={14} fill="currentColor" />}
                        </button>
                      ))
                    )}
                  </div>
               </div>

               <div>
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Reason (Optional)</label>
                 <textarea 
                   value={pitchReason}
                   onChange={(e) => setPitchReason(e.target.value)}
                   placeholder="Why should the group buy this?"
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D624B]/20 min-h-[100px] resize-none"
                 />
               </div>

               <button 
                 disabled={!selectedGroup || pitching}
                 onClick={handlePitch}
                 className="w-full bg-[#0D624B] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0D624B]/20 disabled:opacity-50"
               >
                 {pitching ? <Loader2 className="animate-spin" size={20} /> : `Pitch ${symbol?.split('.')[0]}`}
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
