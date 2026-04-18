"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import CustomInput from "@/component/LoginComps/CustomInput";
import { apiFetch } from "@/lib/api";

export default function NewGroupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    guidelines: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [inviteId, setInviteId] = useState("");

  const handleAddInvite = () => {
    if (!inviteId.trim()) return;
    if (invitedIds.includes(inviteId.trim())) {
      setInviteId("");
      return;
    }
    setInvitedIds(prev => [...prev, inviteId.trim()]);
    setInviteId("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await apiFetch(`/groups/`, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          invited_finova_ids: invitedIds
        }),
      });

      if (response.ok) {
        alert("Group created successfully!");
        router.push("/groups");
      } else {
        const data = await response.json();
        setErrorMsg(data.detail || "Failed to create group");
      }
    } catch (err) {
      setErrorMsg("Network error. Could not connect to API.");
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
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Create a Club</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Start your own investment syndicate</p>
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
            label="Club Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wall Street Wolves"
            required
          />

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-600">
              Description <span className="text-gray-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this club about? Focus, goals, etc."
              className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-800 outline-none transition-all focus:border-[#0D624B] focus:ring-1 focus:ring-[#0D624B] shadow-sm sm:shadow-none min-h-[100px]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-600">
              Club Guidelines
            </label>
            <textarea
              name="guidelines"
              value={formData.guidelines}
              onChange={handleChange}
              placeholder="Rules, voting expectations, capital minimums..."
              className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-800 outline-none transition-all focus:border-[#0D624B] focus:ring-1 focus:ring-[#0D624B] shadow-sm sm:shadow-none min-h-[100px]"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-600">
              Invite Founding Members
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={inviteId}
                onChange={(e) => setInviteId(e.target.value.toUpperCase())}
                placeholder="Enter Finova ID (e.g. FHW397)"
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0D624B]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInvite();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddInvite}
                className="rounded-xl bg-[#0D624B]/10 px-4 py-2 text-sm font-semibold text-[#0D624B] transition-colors hover:bg-[#0D624B]/20"
              >
                Add
              </button>
            </div>
            
            {invitedIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {invitedIds.map((id) => (
                  <div key={id} className="flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1.5 shadow-sm">
                    <span className="text-xs font-bold text-gray-700">{id}</span>
                    <button
                      type="button"
                      onClick={() => setInvitedIds(prev => prev.filter(i => i !== id))}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-[11px] text-gray-400 italic">
              Invitations will be sent once the club is created. Users must accept to join.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-[#0D624B] py-4 text-center text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-[#094d3a] focus:outline-none focus:ring-4 focus:ring-[#0D624B]/30 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Club"}
          </button>
        </form>
      </div>
    </div>
  );
}
