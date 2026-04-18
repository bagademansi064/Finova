"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, ChevronRight, Loader2, BarChart3, Search, Eye } from "lucide-react";
import StockItem from "./StockItem";
import StockSearchModal from "./StockSearchModal";
import { apiFetch } from '@/lib/api';

const tabs = ["Invested", "Watchlist"];

export default function StockWatchlist() {
  const [activeTab, setActiveTab] = useState(0);
  const [investedData, setInvestedData] = useState<any[]>([]);
  const [watchlistData, setWatchlistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/users/dashboard/');
      if (response.ok) {
        const data = await response.json();
        setInvestedData(data.invested || []);
        setWatchlistData(data.watchlist || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleAddStock = async (symbol: string) => {
    try {
      const response = await apiFetch('/users/watchlist/', {
        method: 'POST',
        body: JSON.stringify({ symbol })
      });
      if (response.ok) {
        setIsSearchOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      console.error("Failed to add to watchlist", err);
    }
  };

  const stocksToDisplay = activeTab === 0 ? investedData : watchlistData;

  return (
    <div
      className="mx-5 mt-3 rounded-3xl bg-white p-5 shadow-2xl shadow-gray-200/50 border border-gray-100 animate-fade-in-up"
      style={{ animationDelay: "200ms" }}
    >
      {/* Header & Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#f0f2f1] rounded-2xl">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all ${
                activeTab === i
                  ? "bg-white text-[#0D624B] shadow-sm"
                  : "text-[#6b7c75] hover:text-[#0E1B19]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setIsSearchOpen(true)}
          className="h-10 w-10 flex items-center justify-center rounded-2xl bg-[#0D624B] text-white shadow-lg shadow-[#0D624B]/20 active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Stock List */}
      <div className="min-h-[200px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
             <Loader2 className="animate-spin text-[#0D624B]" size={32} />
             <p className="text-[13px] font-medium text-[#8a9690]">Syncing market prices...</p>
          </div>
        ) : stocksToDisplay.length > 0 ? (
          <div className="divide-y divide-[#f0f2f1] stagger-children">
            {stocksToDisplay.map((stock, idx) => (
              <StockItem
                key={`${stock.symbol || stock.stock_symbol}-${idx}`}
                name={(stock.symbol || stock.stock_symbol).replace('.NS', '')}
                exchange="NSE"
                price={stock.current_price}
                changePercent={`${parseFloat(stock.profit_loss_percent || stock.percent_change || 0).toFixed(2)}%`}
                isPositive={parseFloat(stock.profit_loss_percent || stock.percent_change || 0) >= 0}
                clubName={stock.group_name}
                isPL={activeTab === 0}
                change={""}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 bg-[#f7f9f8] rounded-full flex items-center justify-center mb-4">
              {activeTab === 0 ? <BarChart3 className="text-[#8a9690]" size={28} /> : <Eye className="text-[#8a9690]" size={28} />}
            </div>
            <h3 className="text-[15px] font-bold text-[#0E1B19]">
              {activeTab === 0 ? "No investments yet" : "Watchlist is empty"}
            </h3>
            <p className="text-[12px] text-[#8a9690] mt-1 max-w-[200px]">
              {activeTab === 0 
                ? "Join a club and start voting to build your portfolio" 
                : "Search and add stocks to track them here"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && stocksToDisplay.length > 0 && (
        <button
          className="mt-4 flex w-full items-center justify-center gap-2 py-3 rounded-2xl border border-gray-100 text-[13px] font-bold text-[#0E1B19] hover:bg-gray-50 transition-colors"
        >
          Detailed Portfolio Analytics
          <ChevronRight size={16} />
        </button>
      )}

      <StockSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onAdd={handleAddStock}
      />
    </div>
  );
}
