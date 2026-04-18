"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function HomeHeader() {
  const router = useRouter();
  const [hasInvitations, setHasInvitations] = useState(false);

  useEffect(() => {
    const checkInvitations = async () => {
      try {
        const res = await apiFetch("/groups/my-invitations/");
        if (res.ok) {
          const data = await res.json();
          const invites = Array.isArray(data) ? data : data.results || [];
          setHasInvitations(invites.length > 0);
        }
      } catch (err) {
        console.error("Failed to check invitations:", err);
      }
    };
    
    checkInvitations();
  }, []);

  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <img
          src="/finovaLogo.png"
          alt="Finova Logo"
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className="text-xl font-bold tracking-tight text-[#0E1B19]">
          <span className="text-[#00695C]">F</span>inova
        </span>
      </div>

      {/* Notification Bell */}
      <button
        id="notification-bell"
        onClick={() => router.push("/groups/invitations")}
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200 tap-highlight"
        aria-label="Notifications"
      >
        <Bell size={22} strokeWidth={1.8} className="text-[#0E1B19]" />
        {hasInvitations && (
          <span className="absolute right-[8px] top-[8px] flex h-[9px] w-[9px]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-[9px] w-[9px] rounded-full border-[1.5px] border-white bg-red-500"></span>
          </span>
        )}
      </button>
    </div>
  );
}
