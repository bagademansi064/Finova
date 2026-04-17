"use client";
import React from "react";
import { Bell } from "lucide-react";

export default function HomeHeader() {
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
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#e8f5e9] active:bg-[#c8e6c9] tap-highlight"
        aria-label="Notifications"
      >
        <Bell size={22} strokeWidth={1.8} className="text-[#0E1B19]" />
        {/* Optional notification dot */}
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#e53935]" />
      </button>
    </div>
  );
}
