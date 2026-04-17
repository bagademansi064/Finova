"use client";
import React from "react";
import BottomNavBar from "@/component/Home/BottomNavBar";
import { UserCircle } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#f5f7f6] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[#8a9690]" style={{ paddingBottom: "var(--bottom-nav-height)" }}>
        <UserCircle size={48} strokeWidth={1.2} />
        <h1 className="text-xl font-semibold text-[#0E1B19]">Account</h1>
        <p className="text-sm">Coming soon</p>
      </div>
      <BottomNavBar />
    </div>
  );
}
