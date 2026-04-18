"use client";
import React, { useState, useEffect } from "react";
import { Search, X, Plus, Check, TrendingUp, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface StockSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (symbol: string) => void;
}

export default function StockSearchModal({ isOpen, onClose, onAdd }: StockSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [availableStocks, setAvailableStocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Prefetch stock list for local filtering
  useEffect(() => {
    async function fetchList() {
      try {
        const response = await apiFetch('/market/live/'); // Using the live cache endpoint to list available symbols
        if (response.ok) {
          const data = await response.json();
          setAvailableStocks(Object.keys(data));
        }
      } catch (e) {
        console.error("Failed to fetch available stocks", e);
      }
    }
    if (isOpen) fetchList();
  }, [isOpen]);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (val.length < 2) {
      setResults([]);
      return;
    }
    const filtered = availableStocks
      .filter(s => s.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 10);
    setResults(filtered);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0E1B19]">Add to Watchlist</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-[#6b7c75]" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9690]" />
            <input
              autoFocus
              type="text"
              placeholder="Search symbol (e.g. INFY, RELIANCE...)"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[#f0f2f1] border-none rounded-2xl py-3.5 pl-11 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-[#0D624B]/20 transition-all font-medium"
            />
          </div>
        </div>

        {/* Results */}
        <div className="px-2 pb-6 max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-1">
              {results.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => {
                    onAdd(symbol);
                    setQuery("");
                    setResults([]);
                  }}
                  className="flex items-center gap-4 px-4 py-3.5 hover:bg-[#f7f9f8] active:bg-[#edf0ef] rounded-2xl transition-all text-left group"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#e8f5e9] flex items-center justify-center text-[#00695C] group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[15px] text-[#0E1B19]">{symbol}</div>
                    <div className="text-[11px] font-medium text-[#6b7c75]">NSE • Equity</div>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-[#d6ddd9] flex items-center justify-center text-[#6b7c75] group-hover:bg-[#0D624B] group-hover:text-white group-hover:border-[#0D624B] transition-all">
                    <Plus size={18} />
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
              <div className="h-16 w-16 bg-[#f0f2f1] rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-[#8a9690]" />
              </div>
              <p className="text-[#6b7c75] font-medium">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center px-6 text-[#8a9690]">
              <p className="font-medium">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
