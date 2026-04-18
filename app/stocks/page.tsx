"use client";
import React, { useEffect, useMemo, useState } from "react";
import BottomNavBar from "@/component/Home/BottomNavBar";
import {
  ArrowLeft,
  Bell,
  ChartLine,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type MarketStock = {
  symbol: string;
  current_price: number;
  previous_close: number;
  day_high: number;
  day_low: number;
  volume: number;
  percent_change: number;
  market_cap?: number | null;
  pe_ratio?: number | null;
  sector?: string | null;
};

type FilterState = {
  sector: string;
  marketCap: "all" | "large" | "mid" | "small";
  minPrice: number;
  maxPrice: number;
  topGainersOnly: boolean;
  topLosersOnly: boolean;
};

const WATCHLIST_TABS = ["Invested", "Watchlist 1", "Watchlist 2"];
const STOCK_SYMBOLS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "TSLA",
  "NVDA",
  "AMZN",
  "META",
  "NFLX",
];
const MIN_RANGE = 10;
const MAX_RANGE = 500;

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function toMarketCapBucket(value?: number | null): "large" | "mid" | "small" {
  if (!value) return "small";
  if (value >= 100_000_000_000) return "large";
  if (value >= 2_000_000_000) return "mid";
  return "small";
}

function normalizeStock(raw: any): MarketStock {
  return {
    symbol: raw.symbol,
    current_price: parseFloat(raw.current_price) || 0,
    previous_close: parseFloat(raw.previous_close) || 0,
    day_high: parseFloat(raw.day_high) || 0,
    day_low: parseFloat(raw.day_low) || 0,
    volume: Number(raw.volume) || 0,
    percent_change: parseFloat(raw.percent_change) || 0,
    market_cap: raw.market_cap ?? null,
    pe_ratio: raw.pe_ratio ?? null,
    sector: raw.sector ?? "Unknown",
  };
}

export default function StocksPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [stocks, setStocks] = useState<MarketStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState<MarketStock | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    sector: "all",
    marketCap: "all",
    minPrice: MIN_RANGE,
    maxPrice: MAX_RANGE,
    topGainersOnly: false,
    topLosersOnly: false,
  });

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/market/live/?symbols=${STOCK_SYMBOLS.join(",")}`);
        const data = await response.json();
        const parsed = Object.values(data).map((item) => normalizeStock(item));
        setStocks(parsed.sort((a, b) => b.current_price - a.current_price));
      } catch (error) {
        console.error("Failed to load stocks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const sectors = useMemo(() => {
    const base = stocks
      .map((stock) => stock.sector || "Unknown")
      .filter((sector, idx, all) => all.indexOf(sector) === idx);
    return ["all", ...base];
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch = stock.symbol
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      if (!matchesSearch) return false;

      const matchesSector =
        filters.sector === "all" || (stock.sector || "Unknown") === filters.sector;
      if (!matchesSector) return false;

      const bucket = toMarketCapBucket(stock.market_cap);
      const matchesCap = filters.marketCap === "all" || bucket === filters.marketCap;
      if (!matchesCap) return false;

      const matchesPrice =
        stock.current_price >= filters.minPrice && stock.current_price <= filters.maxPrice;
      if (!matchesPrice) return false;

      if (filters.topGainersOnly && stock.percent_change <= 0) return false;
      if (filters.topLosersOnly && stock.percent_change >= 0) return false;

      return true;
    });
  }, [stocks, search, filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      sector: "all",
      marketCap: "all",
      minPrice: MIN_RANGE,
      maxPrice: MAX_RANGE,
      topGainersOnly: false,
      topLosersOnly: false,
    });
  };

  const renderListView = () => (
    <div className="min-h-screen bg-[#f5f7f6]">
      <div
        className="mx-auto max-w-[430px] overflow-y-auto hide-scrollbar px-4 pt-3"
        style={{ paddingBottom: "calc(var(--bottom-nav-height) + 20px)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/finovaLogo.png"
              alt="Finova Logo"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="text-xl font-bold tracking-tight text-[#0E1B19]">
              <span className="text-[#00695C]">F</span>inova
            </span>
          </div>
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#e8f5e9]"
            aria-label="Notifications"
          >
            <Bell size={21} strokeWidth={1.8} className="text-[#0E1B19]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#e53935]" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-[#d6ddd9] bg-white px-4 py-2.5 shadow-sm">
            <Search size={18} className="text-[#9ca8a2]" />
            <input
              type="text"
              placeholder="Search stocks, ETFs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0E1B19] outline-none placeholder:text-[#a3b0aa]"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d6ddd9] bg-white shadow-sm transition-colors hover:bg-[#f0f5f2]"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={18} className="text-[#0E1B19]" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2.5 overflow-x-auto hide-scrollbar pb-1">
          {WATCHLIST_TABS.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`flex-shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold ${
                activeTab === idx
                  ? "border-[#00695C] bg-[#0D624B] text-white"
                  : "border-[#d6ddd9] bg-[#f7f9f8] text-[#6b7c75]"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-[#b0c4b8] text-[#6b7c75]"
            aria-label="Add watchlist"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="mt-2 divide-y divide-[#edf2ef] rounded-2xl bg-white px-4 shadow-sm">
          {loading ? (
            <div className="py-8 text-center text-sm text-[#7d8d86]">Loading stocks...</div>
          ) : filteredStocks.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#7d8d86]">
              No stocks match the current filters.
            </div>
          ) : (
            filteredStocks.map((stock) => {
              const isPositive = stock.percent_change >= 0;
              const absoluteMove =
                (stock.current_price * Math.abs(stock.percent_change)) / 100;
              return (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className="flex w-full items-center justify-between py-3 text-left"
                >
                  <div>
                    <p className="text-[15px] font-semibold text-[#0E1B19]">
                      {stock.symbol.replace(".NS", "")}
                    </p>
                    <p className="text-[11px] font-medium text-[#8a9690]">NASDAQ</p>
                    <p className="text-[10px] text-[#a0ada7]">Qty: 20 Avg: {formatCurrency(stock.current_price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[19px] font-semibold text-[#0E1B19]">
                      {formatCurrency(stock.current_price)}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${
                        isPositive ? "text-[#00897B]" : "text-[#e53935]"
                      }`}
                    >
                      {isPositive ? "+" : "-"}
                      {formatCurrency(absoluteMove)} ({stock.percent_change.toFixed(2)}%)
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-[#1e7d6c] to-[#125649] p-5 text-white shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Sparkles size={16} />
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold">
              New
            </span>
          </div>
          <h3 className="text-[26px] font-bold">Market Insights</h3>
          <p className="mt-1 text-[13px] text-white/80">
            Swipe through today&apos;s top trends and smart moves.
          </p>
          <button className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold">
            Explore Finz <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );

  const renderFilterSheet = () => (
    <div className="fixed inset-0 z-40 bg-black/25">
      <button
        className="h-full w-full"
        onClick={() => setShowFilters(false)}
        aria-label="Close filters overlay"
      />
      <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[430px] rounded-t-[28px] bg-white px-5 pb-6 pt-4 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-[#d3d8d5]" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[32px] font-semibold text-[#0E1B19]">Filters</h2>
          <button
            className="text-sm font-medium text-[#6b7c75]"
            onClick={resetFilters}
          >
            Reset All
          </button>
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#899690]">
          Sector
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => updateFilter("sector", sector)}
              className={`rounded-full px-4 py-2 text-[13px] ${
                filters.sector === sector
                  ? "bg-[#bcece7] text-[#0D624B]"
                  : "bg-[#f2f4f3] text-[#2f3f39]"
              }`}
            >
              {sector === "all" ? "All" : sector}
            </button>
          ))}
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#899690]">
          Market Cap
        </p>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { id: "large", label: "Large", hint: "> $10B" },
            { id: "mid", label: "Mid", hint: "$2B - $10B" },
            { id: "small", label: "Small", hint: "< $2B" },
          ].map((cap) => (
            <button
              key={cap.id}
              onClick={() => updateFilter("marketCap", cap.id as FilterState["marketCap"])}
              className={`rounded-xl border p-3 text-left ${
                filters.marketCap === cap.id
                  ? "border-[#80b8ae] bg-[#edf7f4]"
                  : "border-[#d9dfdc] bg-white"
              }`}
            >
              <p className="text-sm font-semibold text-[#0E1B19]">{cap.label}</p>
              <p className="text-[11px] text-[#819089]">{cap.hint}</p>
            </button>
          ))}
        </div>

        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#899690]">
            Price Range
          </p>
          <p className="text-sm font-semibold text-[#0D624B]">
            ${filters.minPrice} - ${filters.maxPrice}+
          </p>
        </div>
        <div className="relative mb-4 h-9">
          <input
            type="range"
            min={MIN_RANGE}
            max={MAX_RANGE}
            value={filters.minPrice}
            onChange={(e) =>
              updateFilter("minPrice", Math.min(Number(e.target.value), filters.maxPrice - 1))
            }
            className="absolute inset-x-0 top-2 h-1 w-full appearance-none rounded-full bg-[#d8dfdc]"
          />
          <input
            type="range"
            min={MIN_RANGE}
            max={MAX_RANGE}
            value={filters.maxPrice}
            onChange={(e) =>
              updateFilter("maxPrice", Math.max(Number(e.target.value), filters.minPrice + 1))
            }
            className="absolute inset-x-0 top-2 h-1 w-full appearance-none rounded-full bg-transparent"
          />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#899690]">
          Performance (24h)
        </p>
        <div className="mb-5 flex gap-3">
          <button
            onClick={() => updateFilter("topGainersOnly", !filters.topGainersOnly)}
            className={`flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
              filters.topGainersOnly
                ? "border-[#7fb6ac] bg-[#eff8f5] text-[#0D624B]"
                : "border-[#d8dfdc] bg-white text-[#45514c]"
            }`}
          >
            <Filter size={14} />
            Top Gainers
          </button>
          <button
            onClick={() => updateFilter("topLosersOnly", !filters.topLosersOnly)}
            className={`flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
              filters.topLosersOnly
                ? "border-[#7fb6ac] bg-[#eff8f5] text-[#0D624B]"
                : "border-[#d8dfdc] bg-white text-[#45514c]"
            }`}
          >
            <Filter size={14} />
            Top Losers
          </button>
        </div>

        <button
          onClick={() => setShowFilters(false)}
          className="w-full rounded-full bg-[#136a56] py-3 text-base font-semibold text-white shadow"
        >
          Show {filteredStocks.length} Results
        </button>
      </div>
    </div>
  );

  const renderDetailView = (stock: MarketStock) => {
    const isPositive = stock.percent_change >= 0;
    const low = stock.day_low || stock.current_price * 0.96;
    const high = stock.day_high || stock.current_price * 1.04;
    const rangePercent =
      high - low > 0 ? ((stock.current_price - low) / (high - low)) * 100 : 50;

    return (
      <div className="min-h-screen bg-[#f5f7f6]">
        <div
          className="mx-auto max-w-[430px] overflow-y-auto hide-scrollbar px-3 pt-3"
          style={{ paddingBottom: "calc(var(--bottom-nav-height) + 20px)" }}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <button
              onClick={() => setSelectedStock(null)}
              className="flex items-center gap-1 text-sm text-[#0E1B19]"
            >
              <ArrowLeft size={16} />
              <span>Market Insights</span>
            </button>
            <button className="text-[#1f2e29]" aria-label="More options">
              <SlidersHorizontal size={16} />
            </button>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[34px] font-semibold text-[#0E1B19]">
                  {stock.symbol.replace(".NS", "")}
                </h1>
                <p className="text-[11px] text-[#95a19c]">{stock.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-[37px] font-semibold text-[#1f2e29]">
                  {formatCurrency(stock.current_price)}
                </p>
                <p
                  className={`text-[12px] font-medium ${
                    isPositive ? "text-[#00897B]" : "text-[#e53935]"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {stock.percent_change.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <span className="rounded-full border border-[#d8dfdc] px-4 py-1 text-xs">
                NSE
              </span>
              <span className="rounded-full border border-[#d8dfdc] px-4 py-1 text-xs">
                BSE
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="rounded-full bg-[#0D624B] px-4 py-4 text-white">
                <p className="text-[10px] uppercase tracking-wide text-white/80">Sentiment</p>
                <p className="text-[22px] font-semibold">Vote for Buy</p>
              </button>
              <button className="rounded-full bg-[#C4231A] px-4 py-4 text-white">
                <p className="text-[10px] uppercase tracking-wide text-white/80">Sentiment</p>
                <p className="text-[22px] font-semibold">Vote for Sell</p>
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="rounded-full border border-[#dae1de] px-4 py-2 text-sm text-[#30403a]">
                View chart
              </button>
              <button className="rounded-full border border-[#dae1de] px-4 py-2 text-sm text-[#30403a]">
                Option chain
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#0E1B19]">Day&apos;s Performance</h3>
              <ChartLine size={16} className="text-[#7d8d86]" />
            </div>
            <div className="flex items-center justify-between text-xs text-[#8a9690]">
              <span>Low {formatCurrency(low)}</span>
              <span>High {formatCurrency(high)}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[#dde3e0]">
              <div
                className="h-1.5 rounded-full bg-[#0D624B]"
                style={{ width: `${Math.max(0, Math.min(100, rangePercent))}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#f6f8f7] p-3">
                <p className="text-[10px] text-[#86938d]">Open</p>
                <p className="text-[18px] font-semibold text-[#0E1B19]">
                  {formatCurrency(stock.previous_close || stock.current_price)}
                </p>
              </div>
              <div className="rounded-xl bg-[#f6f8f7] p-3">
                <p className="text-[10px] text-[#86938d]">Volume</p>
                <p className="text-[18px] font-semibold text-[#0E1B19]">
                  {(stock.volume / 1_000_000).toFixed(1)}M
                </p>
              </div>
              <div className="rounded-xl bg-[#f6f8f7] p-3">
                <p className="text-[10px] text-[#86938d]">P/E Ratio</p>
                <p className="text-[18px] font-semibold text-[#0E1B19]">
                  {stock.pe_ratio ? stock.pe_ratio.toFixed(2) : "N/A"}
                </p>
              </div>
              <div className="rounded-xl bg-[#f6f8f7] p-3">
                <p className="text-[10px] text-[#86938d]">Sector</p>
                <p className="text-[15px] font-semibold text-[#0E1B19]">
                  {stock.sector || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <BottomNavBar />
      </div>
    );
  };

  return (
    <>
      {selectedStock ? renderDetailView(selectedStock) : renderListView()}
      {showFilters && !selectedStock ? renderFilterSheet() : null}
    </>
  );
}
