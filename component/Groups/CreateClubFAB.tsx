"use client";
import React from "react";
import { Plus } from "lucide-react";

export default function CreateClubFAB() {
  return (
    <button
      id="create-club-fab"
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0D624B] text-white shadow-lg transition-all active:scale-90 hover:shadow-xl tap-highlight"
      style={{
        bottom: "calc(var(--bottom-nav-height) + 20px)",
        right: "20px",
      }}
      aria-label="Create new club"
    >
      <Plus size={26} strokeWidth={2.2} />
    </button>
  );
}
