"use client";
import React, { useState } from "react";
import { X, Send, User } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  finovaId: string; // Group Finova ID
  onSuccess?: (msg: string) => void;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  finovaId,
  onSuccess
}: InviteMemberModalProps) {
  const [targetId, setTargetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async () => {
    if (!targetId.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(`/groups/${finovaId}/invite/`, {
        method: "POST",
        body: JSON.stringify({ user_finova_id: targetId.trim().toUpperCase() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (onSuccess) onSuccess(data.message);
        setTargetId("");
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to send invitation.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#0D624B]/10 p-2.5 rounded-2xl">
              <User size={24} className="text-[#0D624B]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Invite Member</h2>
              <p className="text-xs text-gray-500 font-medium">Add via Finova ID</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-xs font-semibold text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
              User Finova ID
            </label>
            <input
              type="text"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value.toUpperCase())}
              placeholder="e.g. FHW397"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm font-bold text-gray-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#0D624B]/20"
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
          </div>

          <button
            onClick={handleInvite}
            disabled={loading || !targetId.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0D624B] py-4 text-sm font-bold text-white shadow-lg shadow-[#0D624B]/20 transition-all hover:bg-[#094d3a] disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <span>Send Invitation</span>
                <Send size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
