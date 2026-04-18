"use client";
import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { Check, X, Bell } from "lucide-react";

interface Invitation {
  id: string;
  group_name: string;
  invited_by_username: string;
}

export default function InvitationsList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await apiFetch("/groups/invitations/");
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.results || data);
      }
    } catch (e) {
      console.error("Failed to fetch invitations", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: string, action: "accept" | "reject") => {
    try {
      const response = await apiFetch(`/groups/invitations/${id}/respond/`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
        if (action === "accept") {
          window.location.reload(); // Refresh to show new group
        }
      }
    } catch (e) {
      console.error("Failed to respond to invitation", e);
    }
  };

  if (loading || invitations.length === 0) return null;

  return (
    <div className="mt-6 px-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[17px] font-bold text-[#0E1B19] flex items-center gap-2">
          <Bell size={18} className="text-[#0D624B]" />
          Club Invitations
        </h3>
        <span className="bg-[#0D624B]/10 text-[#0D624B] text-[11px] font-bold px-2 py-0.5 rounded-full">
          {invitations.length} New
        </span>
      </div>
      
      <div className="space-y-3">
        {invitations.map((inv) => (
          <div key={inv.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-[#0D624B]/10 animate-fade-in">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {inv.group_name}
              </p>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Invited by <span className="font-medium text-[#0D624B]">@{inv.invited_by_username}</span>
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleRespond(inv.id, "reject")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <X size={18} />
              </button>
              <button
                onClick={() => handleRespond(inv.id, "accept")}
                className="flex h-9 w-12 items-center justify-center rounded-xl bg-[#0D624B] text-white shadow-sm transition-all hover:bg-[#094d3a] hover:scale-105 active:scale-95"
              >
                <Check size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
