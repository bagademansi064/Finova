"use client";
import React from "react";
import { ArrowLeft, Search, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  groupName: string;
  groupAvatar?: string;
  groupInitials?: string;
  avatarBg?: string;
  avatarTextColor?: string;
  pooledCapital: string;
  isActive?: boolean;
}

export default function ChatHeader({
  groupName,
  groupAvatar,
  groupInitials,
  avatarBg = "#e0f2f1",
  avatarTextColor = "#00695C",
  pooledCapital,
  isActive = true,
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 flex items-center gap-3 bg-white px-3 py-3 shadow-sm">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-[#f0f2f1] tap-highlight"
        aria-label="Go back"
      >
        <ArrowLeft size={22} strokeWidth={2} className="text-[#0E1B19]" />
      </button>

      {/* Group Avatar */}
      {groupAvatar ? (
        <img
          src={groupAvatar}
          alt={groupName}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-[#e5e8e6]"
        />
      ) : (
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 ring-[#e5e8e6]"
          style={{ backgroundColor: avatarBg, color: avatarTextColor }}
        >
          {groupInitials || groupName.charAt(0)}
        </div>
      )}

      {/* Title + Status */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[16px] font-bold text-[#0E1B19] truncate leading-tight">
          {groupName}
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] font-medium text-[#6b7c75]">
            Pooled Capital: {pooledCapital}
          </span>
          {isActive && (
            <>
              <span className="text-[11px] text-[#6b7c75]">•</span>
              <span className="text-[11px] font-medium text-[#00897B] uppercase tracking-wide">
                Active Now
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-[#f0f2f1] tap-highlight"
        aria-label="Search"
      >
        <Search size={20} strokeWidth={2} className="text-[#0E1B19]" />
      </button>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-[#f0f2f1] tap-highlight"
        aria-label="More options"
      >
        <MoreVertical size={20} strokeWidth={2} className="text-[#0E1B19]" />
      </button>
    </div>
  );
}
