"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, UserPlus, X, Check, Loader2 } from "lucide-react";
import CustomInput from "@/component/LoginComps/CustomInput";
import { apiFetch } from "@/lib/api";

interface InvitedUser {
  finova_id: string;
  username: string;
  user_level: string;
}

export default function NewGroupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    guidelines: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Member invite state
  const [searchId, setSearchId] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    finova_id: string;
    username: string;
    user_level: string;
    bio: string;
    is_verified: boolean;
  } | null>(null);
  const [searchError, setSearchError] = useState("");
  const [invitedMembers, setInvitedMembers] = useState<InvitedUser[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchUser = async () => {
    const id = searchId.trim().toUpperCase();
    if (!id) return;

    // Already in invite list?
    if (invitedMembers.some((m) => m.finova_id === id)) {
      setSearchError("User already added to invite list.");
      return;
    }

    setSearching(true);
    setSearchError("");
    setSearchResult(null);

    try {
      const res = await apiFetch(`/chat/find/${id}/`);
      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      } else {
        setSearchError("User not found. Check the Finova ID and try again.");
      }
    } catch {
      setSearchError("Network error. Could not search.");
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = () => {
    if (!searchResult) return;
    setInvitedMembers((prev) => [
      ...prev,
      {
        finova_id: searchResult.finova_id,
        username: searchResult.username,
        user_level: searchResult.user_level,
      },
    ]);
    setSearchResult(null);
    setSearchId("");
  };

  const handleRemoveMember = (finovaId: string) => {
    setInvitedMembers((prev) => prev.filter((m) => m.finova_id !== finovaId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Step 1: Create the group
      const response = await apiFetch(`/groups/`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const groupData = await response.json();
        const groupFinovaId = groupData.finova_id;

        // Step 2: Send invitations for each added member
        const invitePromises = invitedMembers.map((member) =>
          apiFetch(`/groups/${groupFinovaId}/invite/`, {
            method: "POST",
            body: JSON.stringify({ user_finova_id: member.finova_id }),
          })
        );

        await Promise.allSettled(invitePromises);

        const memberCount = invitedMembers.length;
        alert(
          `Club created successfully!${
            memberCount > 0
              ? ` ${memberCount} invitation${memberCount > 1 ? "s" : ""} sent.`
              : ""
          }`
        );
        router.push("/groups");
      } else {
        const data = await response.json();
        setErrorMsg(data.detail || data.name?.[0] || "Failed to create group");
      }
    } catch (err) {
      setErrorMsg("Network error. Could not connect to API.");
    } finally {
      setLoading(false);
    }
  };

  const levelColors: Record<string, { bg: string; text: string }> = {
    beginner: { bg: "#d2fae6", text: "#0D624B" },
    intermediate: { bg: "#dbeafe", text: "#2563eb" },
    advanced: { bg: "#fef3c7", text: "#d97706" },
    expert: { bg: "#f3e8ff", text: "#7c3aed" },
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

          {/* ─── Invite Members Section ─── */}
          <div className="mt-2">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              <UserPlus size={15} className="inline mr-1.5 -mt-0.5" />
              Invite Members
            </label>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value.toUpperCase());
                    setSearchError("");
                    setSearchResult(null);
                  }}
                  placeholder="Enter Finova ID (e.g. FHW397)"
                  maxLength={6}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 px-4 pr-10 text-sm text-gray-800 uppercase tracking-wider font-mono outline-none transition-all focus:border-[#0D624B] focus:ring-1 focus:ring-[#0D624B] shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchUser();
                    }
                  }}
                />
                {searchId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchId("");
                      setSearchResult(null);
                      setSearchError("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleSearchUser}
                disabled={searching || searchId.trim().length < 3}
                className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-[#0D624B] text-white shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
              >
                {searching ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}
              </button>
            </div>

            {/* Search Error */}
            {searchError && (
              <p className="text-[12px] text-red-500 font-medium mt-2 ml-1">{searchError}</p>
            )}

            {/* Search Result Card */}
            {searchResult && (
              <div className="mt-3 flex items-center gap-3 bg-white rounded-2xl border border-[#e5e8e6] px-4 py-3.5 shadow-sm animate-fade-in-up">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                  style={{
                    backgroundColor: levelColors[searchResult.user_level]?.bg || "#f0f2f1",
                    color: levelColors[searchResult.user_level]?.text || "#0E1B19",
                  }}
                >
                  {searchResult.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-semibold text-[#0E1B19] block truncate">
                    {searchResult.username}
                  </span>
                  <span className="text-[11px] text-[#6b7c75] font-medium">
                    {searchResult.finova_id} · {searchResult.user_level}
                    {searchResult.is_verified && " ✓"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0D624B] to-[#00897B] text-white text-[12px] font-semibold shadow-sm transition-all active:scale-95"
                >
                  <UserPlus size={14} />
                  Add
                </button>
              </div>
            )}

            {/* Invited Members List */}
            {invitedMembers.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[12px] font-bold text-[#0D624B] uppercase tracking-wider ml-1">
                  {invitedMembers.length} Member{invitedMembers.length > 1 ? "s" : ""} to invite
                </span>
                <div className="bg-white rounded-2xl border border-[#e5e8e6]/50 shadow-sm overflow-hidden divide-y divide-[#f0f2f1]">
                  {invitedMembers.map((member) => (
                    <div
                      key={member.finova_id}
                      className="flex items-center gap-3 px-4 py-3 animate-fade-in-up"
                    >
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                        style={{
                          backgroundColor: levelColors[member.user_level]?.bg || "#f0f2f1",
                          color: levelColors[member.user_level]?.text || "#0E1B19",
                        }}
                      >
                        {member.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[14px] font-semibold text-[#0E1B19] block truncate">
                          {member.username}
                        </span>
                        <span className="text-[11px] text-[#8a9690] font-medium">
                          {member.finova_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#0D624B] bg-[#d2fae6] px-2 py-0.5 rounded-full">
                          PENDING
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.finova_id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#8a9690] hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-[#0D624B] py-4 text-center text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-[#094d3a] focus:outline-none focus:ring-4 focus:ring-[#0D624B]/30 disabled:opacity-70"
          >
            {loading ? "Creating..." : invitedMembers.length > 0 ? `Create Club & Send ${invitedMembers.length} Invite${invitedMembers.length > 1 ? "s" : ""}` : "Create Club"}
          </button>
        </form>
      </div>
    </div>
  );
}
