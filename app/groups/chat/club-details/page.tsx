"use client";
import React, { useState, useEffect, Suspense } from "react";
import { ArrowLeft, MoreVertical, Building2, LogOut, Shield, Crown, Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

/* ── Fallback Mock Data ──────────────────────────────────────── */
const fallbackClub = {
  name: "Eco Alpha Core",
  aum: "$18.2K",
  createdDate: "Jan 2024",
  membersActive: 4,
};

const fallbackMembers = [
  { id: "1", name: "Marcus Lee", joinedDate: "Jan 2024", role: "ADMIN" as const, avatarBg: "#f3e8ff", avatarTextColor: "#7c3aed", initials: "ML" },
  { id: "2", name: "Sarah Chen", joinedDate: "Feb 2024", role: "MEMBER" as const, avatarBg: "#fef3c7", avatarTextColor: "#d97706", initials: "SC" },
  { id: "3", name: "Jordan Smith", joinedDate: "Mar 2024", role: "MEMBER" as const, avatarBg: "#dbeafe", avatarTextColor: "#2563eb", initials: "JS" },
  { id: "4", name: "David Chen", joinedDate: "Apr 2024", role: "MEMBER" as const, avatarBg: "#d1fae5", avatarTextColor: "#059669", initials: "DC" },
];

const avatarColors = [
  { bg: "#f3e8ff", text: "#7c3aed" },
  { bg: "#fef3c7", text: "#d97706" },
  { bg: "#dbeafe", text: "#2563eb" },
  { bg: "#d1fae5", text: "#059669" },
  { bg: "#ffe4e6", text: "#e11d48" },
  { bg: "#e0f2fe", text: "#0284c7" },
];

/* ── Inner Component (uses useSearchParams) ──────────────────── */
function ClubDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const finovaId = searchParams.get("finovaId");

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [clubData, setClubData] = useState(fallbackClub);
  const [members, setMembers] = useState(fallbackMembers);
  const [isLoading, setIsLoading] = useState(!!finovaId);

  useEffect(() => {
    if (!finovaId) return;

    async function fetchClubData() {
      try {
        const res = await apiFetch(`/groups/${finovaId}/`);
        if (res.ok) {
          const data = await res.json();
          const created = data.created_at
            ? new Date(data.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : fallbackClub.createdDate;
          const balance = data.wallet ? parseFloat(data.wallet.current_balance) : 0;

          setClubData({
            name: data.name || fallbackClub.name,
            aum: balance > 0 ? `₹${balance.toLocaleString()}` : fallbackClub.aum,
            createdDate: created,
            membersActive: data.member_count || fallbackClub.membersActive,
          });

          // Fetch members
          const membersRes = await apiFetch(`/groups/${finovaId}/members/`);
          if (membersRes.ok) {
            const membersData = await membersRes.json();
            const membersList = Array.isArray(membersData) ? membersData : (membersData.results || []);
            if (membersList.length > 0) {
              setMembers(
                membersList.map((m: any, idx: number) => {
                  const colors = avatarColors[idx % avatarColors.length];
                  const name = m.user?.full_name || m.user?.username || m.finova_id || `Member ${idx + 1}`;
                  const initials = name.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
                  const joined = m.joined_at
                    ? new Date(m.joined_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : `Member #${idx + 1}`;
                  return {
                    id: m.id || String(idx),
                    name,
                    joinedDate: joined,
                    role: (m.role === "admin" || m.is_admin) ? "ADMIN" as const : "MEMBER" as const,
                    avatarBg: colors.bg,
                    avatarTextColor: colors.text,
                    initials,
                  };
                })
              );
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch club details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClubData();
  }, [finovaId]);

  const handleLeave = async () => {
    if (!finovaId) {
      router.push("/groups");
      return;
    }
    try {
      const res = await apiFetch(`/groups/${finovaId}/leave/`, { method: "POST" });
      if (res.ok) {
        router.push("/groups");
      } else {
        alert("Failed to leave club. Please try again.");
      }
    } catch {
      router.push("/groups");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#0D624B] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#6b7c75] font-medium">Loading club details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f6] flex flex-col">
      {/* ─── Header Bar ─── */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white/90 backdrop-blur-xl px-4 py-3.5 border-b border-[#e5e8e6]/60">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all active:bg-[#f0f2f1] active:scale-95 tap-highlight"
          aria-label="Go back"
        >
          <ArrowLeft size={21} strokeWidth={2.2} className="text-[#0E1B19]" />
        </button>
        <h1 className="text-[17px] font-bold text-[#0E1B19] tracking-tight">
          Club Details
        </h1>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all active:bg-[#f0f2f1] active:scale-95 tap-highlight"
          aria-label="More options"
        >
          <MoreVertical size={20} strokeWidth={2} className="text-[#0E1B19]" />
        </button>
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* ─── Club Hero Section ─── */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          {/* Club Avatar */}
          <div
            className="relative w-[120px] h-[120px] rounded-full shadow-lg animate-fade-in-up overflow-hidden"
            style={{ animationDelay: "0ms" }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1A3C34 0%, #0D624B 50%, #2d5a4e 100%)" }}
            >
              {/* Decorative leaf pattern overlay */}
              <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="leafPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M15 0 Q20 10 15 20 Q10 10 15 0Z" fill="rgba(255,255,255,0.3)" />
                    <path d="M0 15 Q10 20 20 15 Q10 10 0 15Z" fill="rgba(255,255,255,0.2)" />
                  </pattern>
                </defs>
                <circle cx="60" cy="60" r="60" fill="url(#leafPattern)" />
              </svg>
              <span className="text-white text-3xl font-bold z-10 drop-shadow-sm">
                {clubData.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            {/* Glow ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#0D624B]/20 to-transparent -z-10 blur-sm" />
          </div>

          {/* Club Name */}
          <h2
            className="mt-5 text-[26px] font-extrabold text-[#0E1B19] tracking-tight text-center animate-fade-in-up"
            style={{ animationDelay: "80ms" }}
          >
            {clubData.name}
          </h2>

          {/* AUM + Created Date */}
          <div
            className="flex items-center gap-3 mt-3 animate-fade-in-up"
            style={{ animationDelay: "140ms" }}
          >
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3.5 py-1.5 shadow-sm border border-[#e5e8e6]">
              <Building2 size={14} strokeWidth={2} className="text-[#0D624B]" />
              <span className="text-[13px] font-semibold text-[#0E1B19]">
                AUM: {clubData.aum}
              </span>
            </div>
            <span className="text-[13px] text-[#8a9690] font-medium">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} strokeWidth={2} className="text-[#6b7c75]" />
              <span className="text-[13px] text-[#6b7c75] font-medium">
                Created {clubData.createdDate}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Members Section ─── */}
        <div
          className="px-5 mt-2 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-bold text-[#0E1B19]">Members</h3>
            <span className="text-[12px] font-bold text-[#0D624B] bg-[#d2fae6] px-3 py-1 rounded-full tracking-wide">
              {clubData.membersActive} Active
            </span>
          </div>

          {/* Members List */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5e8e6]/50 overflow-hidden divide-y divide-[#f0f2f1]">
            {members.map((member, idx) => (
              <div
                key={member.id}
                className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-[#f8faf9] cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${260 + idx * 60}ms` }}
              >
                {/* Avatar */}
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold shadow-sm"
                  style={{
                    backgroundColor: member.avatarBg,
                    color: member.avatarTextColor,
                  }}
                >
                  {member.initials}
                </div>

                {/* Name + Joined */}
                <div className="flex-1 min-w-0">
                  <span className="text-[15px] font-semibold text-[#0E1B19] block truncate">
                    {member.name}
                  </span>
                  <span className="text-[12px] text-[#8a9690] font-medium mt-0.5 block">
                    Joined {member.joinedDate}
                  </span>
                </div>

                {/* Role Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border ${
                    member.role === "ADMIN"
                      ? "bg-gradient-to-r from-[#0D624B]/10 to-[#d2fae6]/60 text-[#0D624B] border-[#0D624B]/20"
                      : "bg-[#f5f7f6] text-[#6b7c75] border-[#e5e8e6]"
                  }`}
                >
                  {member.role === "ADMIN" ? (
                    <Crown size={11} strokeWidth={2.5} />
                  ) : (
                    <Shield size={10} strokeWidth={2} />
                  )}
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Leave Club Button ─── */}
        <div
          className="flex justify-center mt-10 mb-12 px-5 animate-fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
          {!showLeaveConfirm ? (
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#e53935]/30 text-[#e53935] font-semibold text-[14px] transition-all hover:bg-[#e53935]/5 active:scale-95 active:bg-[#e53935]/10"
            >
              <LogOut size={17} strokeWidth={2.2} />
              Leave Club
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-fade-in-up">
              <p className="text-[13px] text-[#6b7c75] font-medium text-center">
                Are you sure you want to leave?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="px-6 py-2.5 rounded-full bg-[#f0f2f1] text-[#0E1B19] font-semibold text-[13px] transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeave}
                  className="px-6 py-2.5 rounded-full bg-[#e53935] text-white font-semibold text-[13px] transition-all active:scale-95 shadow-md"
                >
                  Confirm Leave
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page Export with Suspense ──────────────────────────────── */
export default function ClubDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#0D624B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ClubDetailsContent />
    </Suspense>
  );
}
