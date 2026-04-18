"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  Users,
  Clock,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import BottomNavBar from "@/component/Home/BottomNavBar";

interface Invitation {
  id: string;
  group: string;
  group_name: string;
  group_finova_id: string;
  group_member_count: number;
  invited_by_username: string;
  invited_by_finova_id: string;
  created_at: string;
  status: string;
}

export default function InvitationsPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await apiFetch("/groups/my-invitations/");
      if (res.ok) {
        const data = await res.json();
        setInvitations(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error("Failed to load invitations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: string) => {
    setActionLoading(invitationId);
    try {
      const res = await apiFetch("/groups/accept-invitation/", {
        method: "POST",
        body: JSON.stringify({ invitation_id: invitationId }),
      });
      if (res.ok) {
        const data = await res.json();
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
        // Navigate to the newly joined group
        if (data.group_finova_id) {
          router.push(`/groups`);
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to accept invitation.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (invitationId: string) => {
    setActionLoading(invitationId);
    try {
      const res = await apiFetch("/groups/reject-invitation/", {
        method: "POST",
        body: JSON.stringify({ invitation_id: invitationId }),
      });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      } else {
        alert("Failed to reject invitation.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f7f6] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white/90 backdrop-blur-xl px-4 py-3.5 border-b border-[#e5e8e6]/60">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all active:bg-[#f0f2f1] active:scale-95 tap-highlight"
          aria-label="Go back"
        >
          <ArrowLeft size={21} strokeWidth={2.2} className="text-[#0E1B19]" />
        </button>
        <h1 className="text-[17px] font-bold text-[#0E1B19] tracking-tight">
          Club Invitations
        </h1>
        <div className="w-9" />
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto hide-scrollbar px-5 py-5"
        style={{ paddingBottom: "calc(var(--bottom-nav-height) + 24px)" }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-3">
            <Loader2 size={28} className="animate-spin text-[#0D624B]" />
            <span className="text-[13px] text-[#6b7c75] font-medium">
              Loading invitations...
            </span>
          </div>
        ) : invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-[#e0f2f1] flex items-center justify-center">
              <Users size={28} className="text-[#0D624B]" />
            </div>
            <div className="text-center">
              <h3 className="text-[16px] font-bold text-[#0E1B19]">
                No Pending Invitations
              </h3>
              <p className="text-[13px] text-[#6b7c75] mt-1 max-w-[250px]">
                When someone invites you to their club, it will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-[#e5e8e6]/50 shadow-sm overflow-hidden animate-fade-in-up"
              >
                {/* Card Body */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    {/* Club Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A3C34] to-[#0D624B] text-white text-[14px] font-bold shadow-sm">
                      {inv.group_name.substring(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-[#0E1B19] truncate">
                        {inv.group_name}
                      </h3>
                      <p className="text-[12px] text-[#6b7c75] mt-0.5">
                        Invited by{" "}
                        <span className="font-semibold text-[#0E1B19]">
                          {inv.invited_by_username}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[11px] text-[#8a9690] font-medium">
                          <Users size={12} />
                          {inv.group_member_count} members
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#8a9690] font-medium">
                          <Clock size={12} />
                          {formatDate(inv.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex border-t border-[#f0f2f1]">
                  <button
                    onClick={() => handleReject(inv.id)}
                    disabled={actionLoading === inv.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-[#6b7c75] transition-colors hover:bg-[#fef2f2] hover:text-[#e53935] active:scale-[0.98] disabled:opacity-50"
                  >
                    {actionLoading === inv.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <X size={15} strokeWidth={2.5} />
                    )}
                    Decline
                  </button>
                  <div className="w-px bg-[#f0f2f1]" />
                  <button
                    onClick={() => handleAccept(inv.id)}
                    disabled={actionLoading === inv.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold text-[#0D624B] transition-colors hover:bg-[#e8f5e9] active:scale-[0.98] disabled:opacity-50"
                  >
                    {actionLoading === inv.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={15} strokeWidth={2.5} />
                    )}
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
