"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, MessageSquare, Timer, ChevronRight, Loader2, Users, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useStockDetail } from "@/lib/context/StockDetailContext";

interface StockData {
  current_price: number;
  percent_change: number;
  volume: number;
  previous_close: number;
  day_high: number;
  day_low: number;
  sector?: string;
}

interface VoterInfo {
  finova_id: string;
  username: string;
  vote: string | null;
  has_capital: boolean;
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
  const { openStockDetail } = useStockDetail();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteChoice, setVoteChoice] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [pollDetails, setPollDetails] = useState<any>(null);

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
    const tick = () => {
      const remaining = deadline - Date.now();
      if (remaining <= 0) { setCountdown("Expired"); return; }
      const hrs = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cardAction, createdAt]);

  // Fetch poll details for voter participation
  useEffect(() => {
    if (cardAction !== "poll" || !pollId || !groupFinovaId) return;
    async function fetchPoll() {
      try {
        const res = await apiFetch(`/groups/${groupFinovaId}/polls/${pollId}/`);
        if (res.ok) {
          const data = await res.json();
          setPollDetails(data);
          const me = data.voter_participation?.find((p: VoterInfo) => p.finova_id === myFinovaId);
          if (me && me.vote) {
            setHasVoted(true);
            setVoteChoice(me.vote);
          }
        }
      } catch (e) {
        console.error("Failed to fetch poll details", e);
      }
    }
    fetchPoll();
    const interval = setInterval(fetchPoll, 10000);
    return () => clearInterval(interval);
  }, [cardAction, pollId, groupFinovaId, myFinovaId]);

  const handleVote = async (choice: string) => {
    if (!pollId || hasVoted || voting) return;
    setVoting(true);
    setVoteChoice(choice);
    try {
      if (onVoteSubmit) onVoteSubmit(pollId, choice);
      setHasVoted(true);
      const res = await apiFetch(`/groups/${groupFinovaId}/polls/${pollId}/`);
      if (res.ok) setPollDetails(await res.json());
    } catch (e) {
      console.error("Vote failed:", e);
    } finally {
      setVoting(false);
    }
  };

  const isPositive = stockData ? stockData.percent_change >= 0 : true;
  const isBuy = pollDirection !== "sell";
  const dirLabel = isBuy ? "BUY" : "SELL";

  // Voter stats
  const voters: VoterInfo[] = pollDetails?.voter_participation || [];
  const yesVotes = voters.filter(v => v.vote === (isBuy ? 'buy' : 'sell')).length;
  const noVotes = voters.filter(v => v.vote === 'hold' || (v.vote && v.vote !== (isBuy ? 'buy' : 'sell'))).length;
  const pendingVotes = voters.filter(v => !v.vote).length;
  const totalVoted = yesVotes + noVotes;
  const yesPercent = totalVoted > 0 ? Math.round((yesVotes / totalVoted) * 100) : 0;
  const noPercent = totalVoted > 0 ? Math.round((noVotes / totalVoted) * 100) : 0;

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} px-3 mb-3`}>
      <div className="w-full max-w-[92%]">
        <div
          className="rounded-2xl overflow-hidden shadow-xl active:scale-[0.98] transition-all cursor-pointer"
          style={{
            background: "linear-gradient(145deg, #064e3b 0%, #065f46 30%, #047857 60%, #059669 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
          onClick={() => openStockDetail(symbol)}
        >
          {/* ── Top Header ────────────────────────────── */}
          <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                {isPositive
                  ? <TrendingUp size={18} className="text-emerald-300" />
                  : <TrendingDown size={18} className="text-red-300" />}
              </div>
              <div>
                <p className="text-white font-black text-[15px] tracking-wide leading-tight">{symbol.replace('.NS','').replace('.BO','')}</p>
                {stockData?.sector && (
                  <p className="text-emerald-200/60 text-[10px] font-semibold uppercase tracking-widest">{stockData.sector}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                cardAction === "discuss" ? "bg-blue-500/80" : isBuy ? "bg-emerald-400/30 border border-emerald-400/40" : "bg-red-400/30 border border-red-400/40"
              }`}>
                {cardAction === "discuss" ? "DISCUSS" : `POLL • ${dirLabel}`}
              </span>
            </div>
          </div>

          {/* ── Price Hero ────────────────────────────── */}
          <div className="px-4 pt-1 pb-3">
            {loading ? (
              <div className="flex items-center gap-2 text-emerald-200/60 text-sm py-4">
                <Loader2 size={16} className="animate-spin" /> Loading market data...
              </div>
            ) : stockData ? (
              <>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-emerald-200/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">Current Price</p>
                    <p className="text-[28px] font-black text-white leading-none tracking-tight">
                      ₹{fmt(stockData.current_price)}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-black ${
                    isPositive
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-red-400/20 text-red-300 border border-red-400/30"
                  }`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isPositive ? "+" : ""}{stockData.percent_change.toFixed(2)}%
                  </div>
                </div>

                {/* ── Stats Grid ──────────────────────── */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-xl px-2.5 py-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-emerald-200/40 text-[8px] font-bold uppercase tracking-widest">Prev Close</p>
                    <p className="text-white text-[13px] font-bold mt-0.5">₹{fmt(stockData.previous_close)}</p>
                  </div>
                  <div className="rounded-xl px-2.5 py-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-emerald-200/40 text-[8px] font-bold uppercase tracking-widest">Day High</p>
                    <p className="text-emerald-300 text-[13px] font-bold mt-0.5">₹{fmt(stockData.day_high)}</p>
                  </div>
                  <div className="rounded-xl px-2.5 py-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-emerald-200/40 text-[8px] font-bold uppercase tracking-widest">Day Low</p>
                    <p className="text-red-300 text-[13px] font-bold mt-0.5">₹{fmt(stockData.day_low)}</p>
                  </div>
                </div>

                {/* ── Volume + Range Bar ──────────────── */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={11} className="text-emerald-200/40" />
                    <span className="text-emerald-200/40 text-[9px] font-bold uppercase tracking-widest">Volume</span>
                  </div>
                  <span className="text-emerald-200/70 text-[11px] font-bold">
                    {stockData.volume ? (stockData.volume >= 1e7 ? (stockData.volume / 1e7).toFixed(2) + " Cr" : (stockData.volume / 1e5).toFixed(2) + " L") : "N/A"}
                  </span>
                </div>
                {stockData.day_low > 0 && stockData.day_high > 0 && (
                  <div className="w-full h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #ef4444, #f59e0b, #10b981)",
                        width: stockData.day_high - stockData.day_low > 0
                          ? `${Math.min(100, Math.max(5, ((stockData.current_price - stockData.day_low) / (stockData.day_high - stockData.day_low)) * 100))}%`
                          : "50%"
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-emerald-200/40 text-sm py-3">Market data unavailable</p>
            )}
          </div>

          {/* ── Voter Participation Section ────────────── */}
          {cardAction === "poll" && voters.length > 0 && (
            <div className="mx-3 mb-3 rounded-xl p-3" style={{ background: "rgba(0,0,0,0.2)" }}>
              {/* Member circles */}
              <div className="flex items-center gap-1 mb-3">
                <Users size={12} className="text-emerald-300/60 mr-1" />
                <span className="text-emerald-200/50 text-[9px] font-bold uppercase tracking-widest mr-auto">Club Members</span>
                <span className="text-emerald-200/60 text-[10px] font-bold">{totalVoted}/{voters.length} voted</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {voters.map((voter, i) => {
                  let ringColor = "ring-white/10";         // default: not voted
                  let bgColor = "bg-white/5";
                  let textColor = "text-white/30";
                  let statusIcon = null;

                  if (voter.vote === 'buy' || (voter.vote === 'sell' && !isBuy)) {
                    // Voted YES (in favor of the proposed direction)
                    ringColor = "ring-emerald-400";
                    bgColor = "bg-emerald-400/20";
                    textColor = "text-emerald-300";
                    statusIcon = <CheckCircle2 size={8} className="text-emerald-400 absolute -bottom-0.5 -right-0.5" />;
                  } else if (voter.vote === 'hold' || (voter.vote && voter.vote !== (isBuy ? 'buy' : 'sell'))) {
                    // Voted NO
                    ringColor = "ring-red-400";
                    bgColor = "bg-red-400/20";
                    textColor = "text-red-300";
                    statusIcon = <XCircle size={8} className="text-red-400 absolute -bottom-0.5 -right-0.5" />;
                  } else if (!voter.has_capital) {
                    // No capital deposited — dimmed
                    ringColor = "ring-white/5";
                    bgColor = "bg-white/3";
                    textColor = "text-white/15";
                  }

                  return (
                    <div key={i} className="relative" title={`${voter.username} — ${voter.vote ? voter.vote.toUpperCase() : (voter.has_capital ? 'Pending' : 'No Capital')}`}>
                      <div className={`h-8 w-8 rounded-full ring-2 ${ringColor} ${bgColor} flex items-center justify-center text-[11px] font-black ${textColor} transition-all`}>
                        {voter.username.substring(0, 2).toUpperCase()}
                      </div>
                      {statusIcon}
                    </div>
                  );
                })}
              </div>

              {/* Consensus progress bar */}
              {totalVoted > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-300 text-[11px] font-black">{yesPercent}% YES</span>
                      <span className="text-emerald-200/20 text-[10px]">•</span>
                      <span className="text-red-300 text-[11px] font-black">{noPercent}% NO</span>
                    </div>
                    {yesPercent >= 60 && (
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Quorum Met ✓
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-l-full transition-all duration-500" style={{ width: `${yesPercent}%`, background: "linear-gradient(90deg, #34d399, #10b981)" }} />
                    <div className="h-full rounded-r-full transition-all duration-500" style={{ width: `${noPercent}%`, background: "linear-gradient(90deg, #f87171, #ef4444)" }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-emerald-200/30 font-bold">{yesVotes} voted yes</span>
                    <span className="text-[9px] text-emerald-200/30 font-bold">{noVotes} voted no</span>
                    {pendingVotes > 0 && <span className="text-[9px] text-emerald-200/30 font-bold">{pendingVotes} pending</span>}
                  </div>
                </div>
              )}

              {totalVoted === 0 && (
                <p className="text-emerald-200/30 text-[10px] font-bold text-center">No votes cast yet — be the first!</p>
              )}
            </div>
          )}

          {/* ── Discussion Action ─────────────────────── */}
          {cardAction === "discuss" && (
            <button
              onClick={(e) => { e.stopPropagation(); onDiscussClick?.(symbol, discussionId); }}
              className="w-full py-3 flex items-center justify-center gap-2 text-emerald-200 hover:text-white transition-colors group"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <MessageSquare size={15} />
              <span className="text-[13px] font-bold">Open Discussion Thread</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* ── Poll Action ───────────────────────────── */}
          {cardAction === "poll" && (
            <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.15)" }}>
              {/* Timer */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-emerald-200/50 text-[11px] font-bold">
                  <Timer size={13} />
                  <span>VOTING ENDS IN</span>
                </div>
                <span className={`font-mono font-black text-[14px] ${
                  countdown === "Expired" ? "text-red-400" : "text-amber-300"
                }`}>
                  {countdown || "--:--:--"}
                </span>
              </div>

              {/* Vote buttons */}
              {!hasVoted && countdown !== "Expired" ? (
                <div className="flex gap-2.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleVote(pollDirection === "sell" ? "sell" : "buy"); }}
                    disabled={voting}
                    className="flex-1 py-3 rounded-xl font-black text-[14px] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(52,211,153,0.2))",
                      border: "1px solid rgba(52,211,153,0.4)",
                      color: "#6ee7b7",
                    }}
                  >
                    {voting && voteChoice === (pollDirection === "sell" ? "sell" : "buy")
                      ? <Loader2 size={15} className="animate-spin" />
                      : <CheckCircle2 size={15} />}
                    Yes, {pollDirection === "sell" ? "Sell" : "Buy"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleVote("hold"); }}
                    disabled={voting}
                    className="flex-1 py-3 rounded-xl font-black text-[14px] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(248,113,113,0.15))",
                      border: "1px solid rgba(248,113,113,0.3)",
                      color: "#fca5a5",
                    }}
                  >
                    {voting && voteChoice === "hold"
                      ? <Loader2 size={15} className="animate-spin" />
                      : <XCircle size={15} />}
                    No, Hold
                  </button>
                </div>
              ) : (
                <div className="text-center py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className={`text-[13px] font-black uppercase tracking-wider ${
                    hasVoted
                      ? (voteChoice === 'buy' || voteChoice === 'sell' ? "text-emerald-300" : "text-red-300")
                      : "text-red-300"
                  }`}>
                    {hasVoted ? `✓ YOU VOTED: ${voteChoice?.toUpperCase()}` : "VOTING HAS ENDED"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end mr-1" : "ml-1"}`}>
          <span className="text-[10px] text-[#8a9690] font-medium">{time}</span>
        </div>
      </div>
    </div>
  );
}
