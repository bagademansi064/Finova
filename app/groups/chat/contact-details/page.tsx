"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
  ArrowLeft,
  MessageSquare,
  UserPlus,
  ChevronRight,
  Ban,
  Flag,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNavBar from "@/component/Home/BottomNavBar";
import { apiFetch } from "@/lib/api";

/* ── Fallback Mock Data ──────────────────────────────────────── */
const fallbackContact = {
  name: "Marcus Lee",
  role: "Senior Investor",
  contactSince: "Jan 2024",
  isOnline: true,
  initials: "ML",
  avatarBg: "#f3e8ff",
  avatarTextColor: "#7c3aed",
};

const fallbackClubs = [
  {
    id: "1",
    name: "Eco Alpha Core",
    joinedSince: "Mar 2024",
    iconBg: "#d2fae6",
    iconColor: "#0D624B",
    icon: "leaf",
  },
  {
    id: "2",
    name: "Tech Pioneers",
    joinedSince: "Jan 2024",
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    icon: "bolt",
  },
];

/* ── Inner Component ─────────────────────────────────────────── */
function ContactDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contactFinovaId = searchParams.get("contactId");
  const sourceGroupId = searchParams.get("groupId");
  const sourceFinovaId = searchParams.get("finovaId");

  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [contactData, setContactData] = useState(fallbackContact);
  const [sharedClubs, setSharedClubs] = useState(fallbackClubs);
  const [isLoading, setIsLoading] = useState(!!contactFinovaId);

  useEffect(() => {
    if (!contactFinovaId) {
      setIsLoading(false);
      return;
    }

    async function fetchContactData() {
      try {
        // Try to fetch user profile
        const res = await apiFetch(`/users/${contactFinovaId}/`);
        if (res.ok) {
          const data = await res.json();
          const name = data.full_name || data.username || contactFinovaId;
          const initials = name.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
          const since = data.date_joined
            ? new Date(data.date_joined).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : fallbackContact.contactSince;

          setContactData({
            name,
            role: data.role || data.investor_type || "Investor",
            contactSince: since,
            isOnline: data.is_online ?? true,
            initials,
            avatarBg: fallbackContact.avatarBg,
            avatarTextColor: fallbackContact.avatarTextColor,
          });
        }

        // Try to fetch shared groups
        const groupsRes = await apiFetch(`/groups/`);
        if (groupsRes.ok) {
          const groupsData = await groupsRes.json();
          const groupsList = Array.isArray(groupsData) ? groupsData : (groupsData.results || []);
          if (groupsList.length > 0) {
            const clubIcons = ["leaf", "bolt", "chart", "star", "globe"];
            const clubColors = [
              { bg: "#d2fae6", color: "#0D624B" },
              { bg: "#dbeafe", color: "#2563eb" },
              { bg: "#fef3c7", color: "#d97706" },
              { bg: "#f3e8ff", color: "#7c3aed" },
              { bg: "#ffe4e6", color: "#e11d48" },
            ];
            setSharedClubs(
              groupsList.slice(0, 4).map((g: any, idx: number) => ({
                id: g.id || String(idx),
                name: g.name,
                joinedSince: g.created_at
                  ? new Date(g.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "Recently",
                iconBg: clubColors[idx % clubColors.length].bg,
                iconColor: clubColors[idx % clubColors.length].color,
                icon: clubIcons[idx % clubIcons.length],
                finovaId: g.finova_id,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch contact details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContactData();
  }, [contactFinovaId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#0D624B] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#6b7c75] font-medium">Loading contact...</span>
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
        <h1 className="text-[17px] font-bold text-[#0D624B] tracking-tight">
          Contact Details
        </h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      {/* ─── Content ─── */}
      <div
        className="flex-1 overflow-y-auto hide-scrollbar"
        style={{ paddingBottom: "calc(var(--bottom-nav-height) + 24px)" }}
      >
        {/* ─── Profile Hero Section ─── */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          {/* Avatar with online indicator */}
          <div
            className="relative animate-fade-in-up"
            style={{ animationDelay: "0ms" }}
          >
            <div
              className="w-[110px] h-[110px] rounded-full flex items-center justify-center shadow-lg text-3xl font-bold ring-4 ring-white"
              style={{
                backgroundColor: contactData.avatarBg,
                color: contactData.avatarTextColor,
              }}
            >
              {contactData.initials}
            </div>
            {/* Online indicator */}
            {contactData.isOnline && (
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#00897B] border-[3px] border-white shadow-sm animate-pulse-dot" />
            )}
          </div>

          {/* Name */}
          <h2
            className="mt-5 text-[26px] font-extrabold text-[#0E1B19] tracking-tight text-center animate-fade-in-up"
            style={{ animationDelay: "80ms" }}
          >
            {contactData.name}
          </h2>

          {/* Role + Contact Since */}
          <p
            className="text-[13px] text-[#6b7c75] font-medium mt-1.5 animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            {contactData.role} • Contact since {contactData.contactSince}
          </p>

          {/* Action Buttons */}
          <div
            className="flex items-center gap-3 mt-6 w-full max-w-xs animate-fade-in-up"
            style={{ animationDelay: "180ms" }}
          >
            <button
              onClick={() => router.back()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#0D624B] to-[#00897B] text-white font-semibold text-[14px] shadow-md shadow-[#0D624B]/25 transition-all active:scale-[0.97] active:shadow-sm"
            >
              <MessageSquare size={17} strokeWidth={2.2} />
              Message
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-[#0E1B19] font-semibold text-[14px] border border-[#e5e8e6] shadow-sm transition-all active:scale-[0.97] active:bg-[#f5f7f6]">
              <UserPlus size={17} strokeWidth={2.2} className="text-[#0D624B]" />
              Refer
            </button>
          </div>
        </div>

        {/* ─── Shared Clubs Section ─── */}
        <div
          className="px-5 mt-4 animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-bold text-[#0E1B19]">
              Shared Clubs
            </h3>
            <span className="text-[12px] font-bold text-[#0D624B] bg-[#d2fae6] px-3 py-1 rounded-full tracking-wide">
              {sharedClubs.length} MUTUAL
            </span>
          </div>

          {/* Club Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5e8e6]/50 overflow-hidden divide-y divide-[#f0f2f1]">
            {sharedClubs.map((club: any, idx: number) => (
              <button
                key={club.id}
                className="flex items-center gap-3.5 px-4 py-4 w-full text-left transition-colors active:bg-[#f8faf9] animate-fade-in-up"
                style={{ animationDelay: `${300 + idx * 60}ms` }}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (club.finovaId) params.set('finovaId', club.finovaId);
                  router.push(`/groups/chat/club-details?${params.toString()}`);
                }}
              >
                {/* Club Icon */}
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-[18px] shadow-sm"
                  style={{
                    backgroundColor: club.iconBg,
                    color: club.iconColor,
                  }}
                >
                  {club.icon === "leaf" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  )}
                </div>

                {/* Club Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[15px] font-semibold text-[#0E1B19] block truncate">
                    {club.name}
                  </span>
                  <span className="text-[12px] text-[#8a9690] font-medium mt-0.5 block">
                    Joint since {club.joinedSince}
                  </span>
                </div>

                {/* Chevron */}
                <ChevronRight
                  size={18}
                  strokeWidth={2}
                  className="text-[#c0c8c4] flex-shrink-0"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Danger Actions ─── */}
        <div
          className="px-5 mt-8 space-y-1 animate-fade-in-up"
          style={{ animationDelay: "420ms" }}
        >
          {/* Block Contact */}
          {!showBlockConfirm ? (
            <button
              onClick={() => setShowBlockConfirm(true)}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-colors active:bg-[#f5f7f6]"
            >
              <Ban size={19} strokeWidth={2} className="text-[#6b7c75]" />
              <span className="text-[15px] font-medium text-[#0E1B19]">
                Block Contact
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#e5e8e6] animate-fade-in-up">
              <span className="text-[13px] text-[#6b7c75] font-medium flex-1">
                Block this contact?
              </span>
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="px-4 py-1.5 rounded-full bg-[#f0f2f1] text-[#0E1B19] text-[12px] font-semibold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button className="px-4 py-1.5 rounded-full bg-[#e53935] text-white text-[12px] font-semibold transition-all active:scale-95 shadow-sm">
                Block
              </button>
            </div>
          )}

          {/* Report */}
          <button className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-colors active:bg-[#f5f7f6]">
            <Flag size={19} strokeWidth={2} className="text-[#e53935]" />
            <span className="text-[15px] font-medium text-[#e53935]">
              Report
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}

/* ── Page Export with Suspense ──────────────────────────────── */
export default function ContactDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f7f6] flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#0D624B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ContactDetailsContent />
    </Suspense>
  );
}
