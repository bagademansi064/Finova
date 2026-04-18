"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { ArrowLeft, Send, TrendingUp, TrendingDown, Loader2, MessageSquare } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

interface Comment {
  id: string;
  author_username: string;
  author_finova_id: string;
  content: string;
  created_at: string;
}

interface DiscussionData {
  id: string;
  stock_symbol: string;
  stock_name: string;
  discussion_type: string;
  reasoning: string;
  status: string;
  engagement_count: number;
  min_engagement_to_unlock_vote: number;
  can_unlock_voting: boolean;
  has_poll: boolean;
  comments: Comment[];
  proposed_by_username: string;
  proposed_by_finova_id: string;
  created_at: string;
}

interface StockInfo {
  current_price: number;
  percent_change: number;
  volume: number;
}

function DiscussionComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") || "";
  const finovaId = searchParams.get("finovaId") || "";
  const symbol = searchParams.get("symbol") || "";
  const discussionId = searchParams.get("discussionId") || "";

  const [discussion, setDiscussion] = useState<DiscussionData | null>(null);
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myFinovaId, setMyFinovaId] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Fetch discussion + stock data + user profile
  useEffect(() => {
    if (!finovaId || !discussionId) return;
    async function fetchAll() {
      try {
        const [meRes, discRes, stockRes] = await Promise.all([
          apiFetch("/users/me/"),
          apiFetch(`/groups/${finovaId}/discussions/${discussionId}/`),
          apiFetch(`/market/live/?symbols=${symbol}`),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setMyFinovaId(meData.finova_id);
        }

        if (discRes.ok) {
          const data = await discRes.json();
          setDiscussion(data);
        }

        if (stockRes.ok) {
          const stockData = await stockRes.json();
          const key = Object.keys(stockData)[0];
          if (key && stockData[key]) {
            setStockInfo({
              current_price: parseFloat(stockData[key].current_price) || 0,
              percent_change: parseFloat(stockData[key].percent_change) || 0,
              volume: stockData[key].volume || 0,
            });
          }
        }
      } catch (e) {
        console.error("Failed to fetch discussion data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [finovaId, discussionId, symbol]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [discussion?.comments]);

  const handleSendComment = async () => {
    if (!newComment.trim() || !discussionId || sending) return;
    setSending(true);
    try {
      const res = await apiFetch(`/groups/${finovaId}/discussions/${discussionId}/comment/`, {
        method: "POST",
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        // Refetch discussion to get updated comments
        const discRes = await apiFetch(`/groups/${finovaId}/discussions/${discussionId}/`);
        if (discRes.ok) {
          setDiscussion(await discRes.json());
        }
        setNewComment("");

        if (data.voting_unlocked) {
          alert(`Voting has been unlocked! Poll ID: ${data.poll_id}`);
        }
      }
    } catch (e) {
      console.error("Failed to send comment:", e);
    } finally {
      setSending(false);
    }
  };

  const isPositive = stockInfo ? stockInfo.percent_change >= 0 : true;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 size={32} className="animate-spin text-[#0D624B]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fafbfa]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-bold text-gray-900 truncate flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-500" />
            {symbol} Discussion
          </h1>
          <p className="text-[11px] text-gray-500">
            {discussion?.engagement_count || 0} comments • Status: {discussion?.status?.toUpperCase() || "OPEN"}
          </p>
        </div>
      </div>

      {/* Stock Info Card */}
      <div className="mx-4 mt-3 rounded-xl overflow-hidden shadow-md border border-gray-100">
        <div className="bg-[#0E1B19] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
              {isPositive ? (
                <TrendingUp size={16} className="text-emerald-400" />
              ) : (
                <TrendingDown size={16} className="text-red-400" />
              )}
            </div>
            <div>
              <span className="text-white font-bold text-[15px]">{symbol}</span>
              {stockInfo && (
                <span className={`ml-2 text-[12px] font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {isPositive ? "+" : ""}{stockInfo.percent_change.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
          {stockInfo && (
            <span className="text-white font-black text-[18px]">
              ₹{stockInfo.current_price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
          )}
        </div>
        {discussion && (
          <div className="bg-white px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Proposed by {discussion.proposed_by_username}</p>
            <p className="text-[13px] text-gray-700 leading-relaxed">{discussion.reasoning}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold uppercase">
                {discussion.discussion_type}
              </span>
              <span className="text-[10px] text-gray-400">
                {discussion.engagement_count}/{discussion.min_engagement_to_unlock_vote} comments to unlock voting
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Comments Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {discussion?.comments && discussion.comments.length > 0 ? (
          discussion.comments.map((comment) => {
            const isOwn = comment.author_finova_id === myFinovaId;
            const dt = new Date(comment.created_at);
            const timeStr = `${dt.getHours()}:${dt.getMinutes().toString().padStart(2, "0")}`;
            return (
              <div key={comment.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${isOwn ? "items-end" : "items-start"}`}>
                  {!isOwn && (
                    <p className="text-[10px] font-semibold text-gray-400 mb-0.5 ml-1">
                      {comment.author_username}
                    </p>
                  )}
                  <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    isOwn
                      ? "bg-[#0E1B19] text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                  }`}>
                    {comment.content}
                  </div>
                  <p className={`text-[9px] text-gray-400 mt-0.5 ${isOwn ? "text-right mr-1" : "ml-1"}`}>
                    {timeStr}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <MessageSquare size={32} strokeWidth={1.5} />
            <p className="mt-2 text-sm">No comments yet. Start the discussion!</p>
          </div>
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Comment Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Share your analysis..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendComment();
            }
          }}
          className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0D624B]/30 border border-gray-200"
        />
        <button
          onClick={handleSendComment}
          disabled={!newComment.trim() || sending}
          className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
            newComment.trim() ? "bg-[#0D624B] text-white shadow-md" : "bg-gray-200 text-gray-400"
          }`}
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function DiscussionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 size={32} className="animate-spin text-[#0D624B]" /></div>}>
      <DiscussionComponent />
    </Suspense>
  );
}
