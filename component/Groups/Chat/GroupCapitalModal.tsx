"use client";
import React, { useState } from "react";
import { X, ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface GroupCapitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  finovaId: string;
  onSuccess: () => void;
  currentCapital: number;
}

export default function GroupCapitalModal({
  isOpen,
  onClose,
  finovaId,
  onSuccess,
  currentCapital,
}: GroupCapitalModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<"deposit" | "withdraw" | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setLoading(type);
    setError("");

    try {
      const response = await apiFetch(`/groups/${finovaId}/${type}/`, {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setAmount("");
      } else {
        const errData = await response.json();
        setError(errData.error || `Failed to ${type} funds.`);
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-[2rem] rounded-b-none sm:rounded-[2rem] bg-white p-6 shadow-2xl relative animate-slide-up-bottom transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-1">Manage Pool</h3>
        <p className="text-sm text-gray-500 mb-6">Current Pool: <span className="font-bold text-[#00695C]">₹{currentCapital.toLocaleString()}</span></p>

        {/* Amount Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="text-gray-500 font-semibold text-lg">₹</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#f5f7f6] rounded-2xl py-4 pl-10 pr-4 text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00695C] transition-shadow placeholder-gray-300"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-semibold mb-4 ml-1">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleTransaction("deposit")}
            disabled={loading !== null}
            className="flex-1 flex justify-center items-center gap-2 py-3.5 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#2e7d32] font-bold rounded-2xl transition disabled:opacity-50"
          >
            {loading === "deposit" ? <Loader2 size={18} className="animate-spin" /> : <ArrowDownRight size={18} />}
            Deposit
          </button>
          <button
            onClick={() => handleTransaction("withdraw")}
            disabled={loading !== null}
            className="flex-1 flex justify-center items-center gap-2 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition disabled:opacity-50"
          >
            {loading === "withdraw" ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={18} />}
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
