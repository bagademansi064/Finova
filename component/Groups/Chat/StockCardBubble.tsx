"use client";
import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, MessageSquare, Vote, Timer, ChevronRight, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface StockData {
  current_price: number;
  percent_change: number;
  volume: number;
  previous_close: number;
  day_high: number;
  day_low: number;
  sector?: string;
}

interface StockCardBubbleProps {
  symbol: string;
  cardAction?: "discuss" | "poll" | null;
  pollDirection?: "buy" | "sell" | null;
  messageText: string;
  isOwn: boolean;
  time: string;
  groupFinovaId: string;
  discussionId?: string;
  pollId?: string;
  createdAt?: string;
  myFinovaId?: string;
  onDiscussClick?: (symbol: string, discussionId?: string) => void;
  onVoteSubmit?: (pollId: string, choice: string) => void;
}

export default function StockCardBubble({
  symbol,
  cardAction,
  pollDirection,
  messageText,
  isOwn,
  time,
  groupFinovaId,
  discussionId,
  pollId,
  createdAt,
  myFinovaId,
  onDiscussClick,
  onVoteSubmit,
}: StockCardBubbleProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteChoice, setVoteChoice] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Fetch live stock data
  useEffect(() => {
    if (!symbol || symbol === "UNKNOWN") return;
    async function fetchStock() {
      try {
        const res = await apiFetch(`/market/live/?symbols=${symbol}`);
        if (res.ok) {
          const data = await res.json();
          const key = Object.keys(data).find(k => k.toUpperCase().includes(symbol.toUpperCase().replace('.NS','').replace('.BO','')));
          if (key && data[key]) {
            setStockData({
              current_price: parseFloat(data[key].current_price) || 0,
              percent_change: parseFloat(data[key].percent_change) || 0,
              volume: data[key].volume || 0,
              previous_close: parseFloat(data[key].previous_close) || 0,
              day_high: parseFloat(data[key].day_high) || 0,
              day_low: parseFloat(data[key].day_low) || 0,
              sector: data[key].sector,
            });
          }
        }
      } catch (e) {
        console.error("Failed to fetch stock data for card:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStock();
  }, [symbol]);

  // Countdown timer for polls
  useEffect(() => {
    if (cardAction !== "poll" || !createdAt) return;
    const deadline = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        setCountdown("Expired");
        clearInterval(interval);
        return;
      }
      const hrs = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [cardAction, createdAt]);

  const handleVote = async (choice: string) => {
    if (!pollId || hasVoted || voting) return;
    setVoting(true);
    setVoteChoice(choice);
    try {
      if (onVoteSubmit) {
        onVoteSubmit(pollId, choice);
      }
      setHasVoted(true);
    } catch (e) {
      console.error("Vote failed:", e);
    } finally {
      setVoting(false);
    }
  };

  const isPositive = stockData ? stockData.percent_change >= 0 : true;
  const labelColor = cardAction === "discuss" ? "bg-blue-500" : cardAction === "poll" ? (pollDirection === "buy" ? "bg-emerald-500" : "bg-red-500") : "bg-teal-600";
  const labelText = cardAction === "discuss" ? "DISCUSS" : cardAction === "poll" ? `POLL • ${(pollDirection || "BUY").toUpperCase()}` : "STOCK INFO";

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} px-4 mb-2`}>
      <div className="w-full max-w-[88%]">
        {/* Card */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-800/20">
          {/* Header bar */}
          <div className="bg-[#0E1B19] px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center">
                {isPositive ? (
                  <TrendingUp size={14} className="text-emerald-400" />
                ) : (
                  <TrendingDown size={14} className="text-red-400" />
                )}
              </div>
              <span className="text-white font-bold text-[14px] tracking-wide">{symbol}</span>
            </div>
            <span className={`${labelColor} text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest`}>
              {labelText}
            </span>
          </div>

          {/* Price section */}
          <div className="bg-[#132a25] px-4 py-3">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 size={14} className="animate-spin" /> Loading market data...
              </div>
            ) : stockData ? (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Current Price</p>
                  <p className="text-[22px] font-black text-white leading-tight">
                    ₹{stockData.current_price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-bold ${
                    isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositive ? "+" : ""}{stockData.percent_change.toFixed(2)}%
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Vol: {stockData.volume ? (stockData.volume / 1e6).toFixed(2) + "M" : "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Market data unavailable</p>
            )}

            {/* Day range bar */}
            {stockData && stockData.day_low > 0 && (
              <div className="mt-3 pt-2 border-t border-white/5">
                <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                  <span>L: ₹{stockData.day_low.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                  <span>Day Range</span>
                  <span>H: ₹{stockData.day_high.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"
                    style={{
                      width: stockData.day_high - stockData.day_low > 0
                        ? `${((stockData.current_price - stockData.day_low) / (stockData.day_high - stockData.day_low)) * 100}%`
                        : "50%"
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action section */}
          {cardAction === "discuss" && (
            <button
              onClick={() => onDiscussClick?.(symbol, discussionId)}
              className="w-full bg-[#0a1f1b] py-3 flex items-center justify-center gap-2 text-blue-400 hover:bg-[#0d2924] transition-colors group"
            >
              <MessageSquare size={15} />
              <span className="text-[13px] font-semibold">Open Discussion Thread</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {cardAction === "poll" && (
            <div className="bg-[#0a1f1b] px-4 py-3">
              {/* Timer */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                  <Timer size={13} />
                  <span>Voting ends in</span>
                </div>
                <span className={`font-mono font-bold text-[13px] ${
                  countdown === "Expired" ? "text-red-400" : "text-amber-400"
                }`}>
                  {countdown || "--:--:--"}
                </span>
              </div>

              {/* Vote buttons */}
              {!hasVoted && countdown !== "Expired" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVote(pollDirection === "sell" ? "sell" : "buy")}
                    disabled={voting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 font-bold text-[13px] hover:bg-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {voting && voteChoice === (pollDirection === "sell" ? "sell" : "buy") ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : null}
                    Yes, {pollDirection === "sell" ? "Sell" : "Buy"}
                  </button>
                  <button
                    onClick={() => handleVote("hold")}
                    disabled={voting}
                    className="flex-1 py-2.5 rounded-xl bg-red-600/20 text-red-400 font-bold text-[13px] hover:bg-red-600/30 transition disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {voting && voteChoice === "hold" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : null}
                    No, Hold
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className={`text-[13px] font-semibold ${
                    hasVoted ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {hasVoted ? `You voted: ${voteChoice?.toUpperCase()}` : "Voting has ended"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end mr-1" : "ml-1"}`}>
          <span className="text-[10px] text-[#8a9690]">{time}</span>
        </div>
      </div>
    </div>
  );
}
