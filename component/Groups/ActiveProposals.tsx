"use client";
import React, { useState } from "react";
import { Trophy, Leaf, Users, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Proposal {
  id: number;
  group_id: number;
  clubIcon: React.ReactNode;
  clubName: string;
  title: string;
  endsIn: string;
  actionLabel: string;
  memberCount?: number;
}

// Simulated initially, but ready to be replaced with a real fetch
const initialProposals: Proposal[] = [
  {
    id: 1,
    group_id: 101, // Example group ID
    clubIcon: <Trophy size={12} strokeWidth={2} className="text-[#00695C]" />,
    clubName: "Tech Bulls",
    title: "Buy 50 shares of MSFT",
    endsIn: "Ends in 12h",
    actionLabel: "Vote",
    memberCount: 4,
  },
  {
    id: 2,
    group_id: 102,
    clubIcon: <Leaf size={12} strokeWidth={2} className="text-[#00695C]" />,
    clubName: "Eco Alpha",
    title: "Sell TCS positions",
    endsIn: "Ends in 2d",
    actionLabel: "Review",
  },
];

export default function ActiveProposals() {
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType: "buy" | "sell") => {
    if (!activeProposal) return;
    setLoading(true);
    try {
      const response = await apiFetch(`/groups/${activeProposal.group_id}/discussions/${activeProposal.id}/vote/`, {
        method: 'POST',
        body: JSON.stringify({ vote_type: voteType }),
      });
      if (response.ok) {
        alert('Vote cast successfully. Turbo-Reduction calculation triggered on server.');
        setActiveProposal(null);
      } else {
        const err = await response.json();
        alert(err.detail || 'Failed to vote');
      }
    } catch {
      alert('Network error while voting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        {initialProposals.map((p) => (
          <div
            key={p.id}
            onClick={() => setActiveProposal(p)}
            className="flex-shrink-0 w-[220px] rounded-2xl border border-[#d6e8df] bg-gradient-to-br from-[#f7fdf9] to-[#eef6f1] p-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
          >
            {/* Club badge */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e0f2f1]">
                {p.clubIcon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5d7a72]">
                {p.clubName}
              </span>
            </div>

            {/* Proposal Title */}
            <h4 className="mt-2.5 text-[14px] font-semibold leading-snug text-[#0E1B19]">
              {p.title}
            </h4>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-[#8a9690]">{p.endsIn}</span>
              <div className="flex items-center gap-1.5">
                {p.memberCount && (
                  <div className="flex items-center gap-0.5">
                    <Users size={12} className="text-[#8a9690]" />
                    <span className="text-[10px] text-[#8a9690]">
                      {p.memberCount}
                    </span>
                  </div>
                )}
                {!p.memberCount && (
                  <span className="rounded-full bg-[#0E1B19]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#0E1B19]">
                    {p.actionLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voting Modal */}
      {activeProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Cast your vote</h3>
            <p className="text-gray-500 text-sm mb-6">Proposal: {activeProposal.title}</p>

            <div className="flex gap-4">
              <button 
                onClick={() => handleVote("buy")}
                disabled={loading}
                className="flex-1 flex justify-center items-center py-3 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#2e7d32] font-semibold rounded-2xl transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ThumbsUp size={20} className="mr-2" />} Buy / Approve
              </button>
              <button 
                onClick={() => handleVote("sell")}
                disabled={loading}
                className="flex-1 flex justify-center items-center py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-2xl transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ThumbsDown size={20} className="mr-2" />} Sell / Reject
              </button>
            </div>

            <button 
              onClick={() => setActiveProposal(null)}
              className="mt-6 w-full text-center text-sm font-semibold text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
