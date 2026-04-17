"use client";
import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";

interface ClubMessageProps {
  name: string;
  message: string;
  avatarInitials?: string;
  avatarBg?: string;
  avatarTextColor?: string;
  avatarUrl?: string;
}

export default function ClubMessage({
  name,
  message,
  avatarInitials,
  avatarBg = "#e0f2f1",
  avatarTextColor = "#00695C",
  avatarUrl,
}: ClubMessageProps) {
  return (
    <Link href="/groups/chat" className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm animate-fade-in-up cursor-pointer transition-shadow hover:shadow-md no-underline">
      {/* Avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: avatarBg, color: avatarTextColor }}
        >
          {avatarInitials || name.charAt(0)}
        </div>
      )}

      {/* Name + Message */}
      <div className="flex-1 min-w-0">
        <span className="text-[14px] font-semibold text-[#0E1B19]">
          {name}
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <Check
            size={13}
            strokeWidth={2.2}
            className="text-[#00695C] flex-shrink-0"
          />
          <p className="text-[12px] text-[#6b7c75] truncate">{message}</p>
        </div>
      </div>
    </Link>
  );
}
