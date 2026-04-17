"use client";
import React, { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import StockItem from "./StockItem";

const tabs = ["Invested", "Watchlist 1", "Watchlist 2"];

const stocksData = [
  {
    name: "HDFCBANK",
    exchange: "NSE",
    badge: "EVENT",
    price: "799.45",
    change: "-10.25",
    changePercent: "-1.26%",
    isPositive: false,
  },
  {
    name: "INFY",
    exchange: "NSE",
    price: "1,311.40",
    change: "6.30",
    changePercent: "+0.48%",
    isPositive: true,
  },
  {
    name: "TCS",
    exchange: "BSE",
    price: "2,571.75",
    change: "17.25",
    changePercent: "+0.67%",
    isPositive: true,
  },
  {
    name: "ONGC",
    exchange: "NSE",
    price: "282.95",
    change: "-4.85",
    changePercent: "-1.67%",
    isPositive: false,
  },
];

export default function StockWatchlist() {
  const [activeTab, setActiveTab] = useState(0);

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
        {stocksData.map((stock) => (
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
        ))}
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
