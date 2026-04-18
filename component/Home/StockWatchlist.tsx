"use client";
import React, { useState, useEffect } from "react";
import { Plus, ChevronRight, Loader2 } from "lucide-react";
import StockItem from "./StockItem";
import { apiFetch } from '@/lib/api';

const tabs = ["Invested", "Watchlist 1", "Watchlist 2"];

export default function StockWatchlist() {
  const [activeTab, setActiveTab] = useState(0);
  const [stocksData, setStocksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        // Using sample NIFTY 50 blue chips default string, replace later if user has a custom watchlist
        const response = await apiFetch('/market/live/?symbols=HDFCBANK.NS,INFY.NS,TCS.NS,ONGC.NS');
        const data = await response.json();
        
        // Transform Zerodha-Style backend dictionary to Array
        const formattedData = Object.values(data).map((stock: any) => ({
          name: stock.symbol.replace('.NS', ''),
          exchange: "NSE",
          badge: stock.dividend_yield ? "DIVIDEND" : null,
          price: stock.current_price,
          change: (stock.current_price * (parseFloat(stock.percent_change) / 100)).toFixed(2),
          changePercent: `${parseFloat(stock.percent_change) > 0 ? '+' : ''}${stock.percent_change}%`,
          isPositive: parseFloat(stock.percent_change) >= 0,
        }));

        setStocksData(formattedData);
      } catch (err) {
        console.error("Failed to load market data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div
      className="mx-5 mt-3 rounded-2xl bg-white p-4 shadow-sm animate-fade-in-up"
      style={{ animationDelay: "200ms" }}
    >
      {/* Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar pb-1">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            id={`watchlist-tab-${i}`}
            onClick={() => setActiveTab(i)}
            className={`flex-shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all tap-highlight ${
              activeTab === i
                ? "border-[#00695C] bg-white text-[#00695C] shadow-sm"
                : "border-[#d6ddd9] bg-[#f7f9f8] text-[#6b7c75] hover:bg-[#eef2f0]"
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          id="add-watchlist-btn"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-[#b0c4b8] text-[#6b7c75] transition-colors hover:bg-[#f0f5f2] tap-highlight"
          aria-label="Add watchlist"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Stock List */}
      <div className="mt-2 divide-y divide-[#f0f2f1] stagger-children">
        {loading ? (
          <div className="flex justify-center p-4">
             <Loader2 className="animate-spin text-[#0D624B]" />
          </div>
        ) : (
          stocksData.map((stock) => (
            <StockItem
              key={stock.name}
              name={stock.name}
              exchange={stock.exchange}
              badge={stock.badge}
              price={stock.price}
              change={stock.change}
              changePercent={stock.changePercent}
              isPositive={stock.isPositive}
            />
          ))
        )}
      </div>

      {/* View More */}
      <button
        id="view-more-stocks"
        className="mt-1 flex w-full items-center justify-center gap-1 py-1.5 text-[13px] font-semibold text-[#0E1B19] transition-colors hover:text-[#00695C] tap-highlight"
      >
        View More
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
