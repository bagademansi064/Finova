"use client";
import React from "react";

export default function ClubsHeader() {
  return (
    <div className="flex items-center gap-2.5 px-5 pt-3 pb-1">
      {/* Logo */}
      <img
        src="/finovaLogo.png"
        alt="Finova Logo"
        className="h-9 w-9 rounded-full object-cover"
      />
      {/* Title */}
      <span className="text-xl font-bold tracking-tight text-[#0E1B19]">
        <span className="text-[#00695C]">F</span>inova{" "}
        <span className="text-[#00695C]">C</span>lubs
      </span>
    </div>
  );
}
