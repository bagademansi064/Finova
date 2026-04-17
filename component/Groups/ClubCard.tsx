"use client";
import React from "react";
import { Users } from "lucide-react";
import Link from "next/link";

interface ClubCardProps {
  name: string;
  initials: string;
  avatarBg: string;
  avatarTextColor?: string;
  description: string;
  members: number;
  aum: string;
  returnPercent: string;
  isPositive?: boolean;
}

export default function ClubCard({
  name,
  initials,
  avatarBg,
  avatarTextColor = "#fff",
  description,
  members,
  aum,
  returnPercent,
  isPositive = true,
}: ClubCardProps) {
  return (
    <Link href="/groups/chat" className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer animate-fade-in-up no-underline">
      {/* Top Row: Avatar + Name + Return */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: avatarBg, color: avatarTextColor }}
        >
          {initials}
        </div>

        {/* Name + Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-[15px] font-semibold text-[#0E1B19] truncate">
              {name}
            </h4>
            <span
              className={`text-[13px] font-bold flex-shrink-0 ml-2 ${
                isPositive ? "text-[#00695C]" : "text-[#e53935]"
              }`}
            >
              {isPositive ? "+" : ""}
              {returnPercent}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] leading-relaxed text-[#6b7c75] line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom Row: Members + AUM */}
      <div className="flex items-center justify-between pl-14">
        <div className="flex items-center gap-1 text-[11px] text-[#8a9690]">
          <Users size={13} strokeWidth={1.8} />
          <span>{members} Members</span>
        </div>
        <span className="text-[11px] font-medium text-[#8a9690]">
          AUM: {aum}
        </span>
      </div>
    </Link>
  );
}
