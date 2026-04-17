"use client";
import React from "react";
import { Compass } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3f0]">
        <Compass size={28} strokeWidth={1.4} className="text-[#8a9690]" />
      </div>
      <p className="mt-3 text-[14px] font-medium text-[#8a9690]">
        Discover more clubs
      </p>
    </div>
  );
}
