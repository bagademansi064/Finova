"use client";
import React from "react";
import { Check, X, Users, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Invitation {
  id: string;
  group_name: string;
  group_member_count: number;
  group_risk_level: string;
  invited_by_username: string;
}

interface NotificationDropdownProps {
  invitations: Invitation[];
  onRespond: (id: string, action: "accept" | "reject") => void;
  onClose: () => void;
}

export default function NotificationDropdown({
  invitations,
  onRespond,
  onClose
}: NotificationDropdownProps) {
  return (
    <div className="absolute right-0 top-12 z-[100] w-[320px] rounded-3xl bg-white p-4 shadow-2xl border border-gray-100 animate-slide-down">
      <div className="flex items-center justify-between mb-4 px-1">
        <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
        <button onClick={onClose} className="text-[11px] font-bold text-[#0D624B] hover:underline">
          Dismiss all
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto hide-scrollbar space-y-3">
        {invitations.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-gray-400 font-medium">No new notifications</p>
          </div>
        ) : (
          invitations.map((inv) => (
            <div 
              key={inv.id} 
              className="rounded-2xl bg-gray-50/50 p-3 border border-gray-100 transition-colors hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">
                    Invite to {inv.group_name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    From <span className="text-[#0D624B]">@{inv.invited_by_username}</span>
                  </p>
                </div>
                <div className="bg-[#0D624B]/10 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                   <Users size={10} className="text-[#0D624B]" />
                   <span className="text-[9px] font-bold text-[#0D624B]">{inv.group_member_count}</span>
                </div>
              </div>

              <div className="mb-3 flex items-center gap-2">
                 <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-[9px] font-bold text-amber-600">
                    <AlertTriangle size={10} />
                    {inv.group_risk_level} Risk
                 </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onRespond(inv.id, "reject")}
                  className="flex-1 rounded-xl bg-white border border-gray-200 py-2 text-[11px] font-bold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  Reject
                </button>
                <button
                  onClick={() => onRespond(inv.id, "accept")}
                  className="flex-1 rounded-xl bg-[#0D624B] py-2 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-[#094d3a]"
                >
                  Accept
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
