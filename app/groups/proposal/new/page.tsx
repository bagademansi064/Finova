"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import CustomInput from "@/component/LoginComps/CustomInput";
import CustomSelect from "@/component/LoginComps/CustomSelect";
import { apiFetch } from "@/lib/api";

function ProposalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');

  const [formData, setFormData] = useState({
    stockSymbol: "",
    discussionType: "buy",
    reasoning: "",
    requiredCapital: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await apiFetch(`/groups/${groupId || '101'}/discussions/`, {
        method: "POST",
        body: JSON.stringify({
          stock_symbol: formData.stockSymbol,
          discussion_type: formData.discussionType,
          reasoning: formData.reasoning,
          required_capital: formData.requiredCapital,
        }),
      });

      if (response.ok) {
        router.push("/groups");
      } else {
        const data = await response.json();
        setErrorMsg(data.detail || "Failed to submit proposal");
      }
    } catch (err) {
      setErrorMsg("Network error. Could not submit proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f6] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white/80 px-4 py-4 backdrop-blur-lg">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-700 transition-colors hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Create Trade Proposal</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Propose an investment to the group</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
              {errorMsg}
            </div>
          )}

          <CustomInput
            label="Stock Symbol (Ticker)"
            name="stockSymbol"
            value={formData.stockSymbol}
            onChange={handleChange}
            placeholder="e.g. INFY, AAPL"
            required
            style={{ textTransform: 'uppercase' }}
          />

          <CustomSelect
            label="Side"
            name="discussionType"
            value={formData.discussionType}
            onChange={handleChange}
            options={[
              { label: "Execution: Buy", value: "buy" },
              { label: "Execution: Sell", value: "sell" },
            ]}
            required
          />

          <CustomInput
            label="Required Capital (USD / INR)"
            name="requiredCapital"
            type="number"
            value={formData.requiredCapital}
            onChange={handleChange}
            placeholder="1000.00"
            required
          />

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-600">
              Reasoning & Thesis <span className="text-gray-400">*</span>
            </label>
            <textarea
              name="reasoning"
              value={formData.reasoning}
              onChange={handleChange}
              placeholder="Explain why you are proposing this trade..."
              className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-800 outline-none transition-all focus:border-[#0D624B] focus:ring-1 focus:ring-[#0D624B] shadow-sm sm:shadow-none min-h-[120px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-[#0D624B] py-4 text-center text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-[#094d3a] focus:outline-none focus:ring-4 focus:ring-[#0D624B]/30 disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Proposal"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center bg-[#f5f7f6] min-h-screen">Loading proposal form...</div>}>
      <ProposalForm />
    </Suspense>
  );
}
