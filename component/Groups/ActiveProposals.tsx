"use client";
import React from "react";
import { Trophy, Leaf, Users, Eye } from "lucide-react";

interface Proposal {
  id: number;
  clubIcon: React.ReactNode;
  clubName: string;
  title: string;
  endsIn: string;
  actionLabel: string;
  memberCount?: number;
}

const proposals: Proposal[] = [
  {
    id: 1,
    clubIcon: <Trophy size={12} strokeWidth={2} className="text-[#00695C]" />,
    clubName: "Tech Bulls",
    title: "Acquire 50 shares of MSFT",
    endsIn: "Ends in 12h",
    actionLabel: "Vote",
    memberCount: 4,
  },
  {
    id: 2,
    clubIcon: <Leaf size={12} strokeWidth={2} className="text-[#00695C]" />,
    clubName: "Eco Alpha",
    title: "Adjust management fee structure",
    endsIn: "Ends in 2d",
    actionLabel: "Review",
  },
];

export default function ActiveProposals() {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
      {proposals.map((p) => (
        <div
          key={p.id}
          className="flex-shrink-0 w-[220px] rounded-2xl border border-[#d6e8df] bg-gradient-to-br from-[#f7fdf9] to-[#eef6f1] p-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        >
          {/* Club badge */}
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e0f2f1]">
              {p.clubIcon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5d7a72]">
              {p.clubName}
            </span>
          </div>

          {/* Proposal Title */}
          <h4 className="mt-2.5 text-[14px] font-semibold leading-snug text-[#0E1B19]">
            {p.title}
          </h4>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-[#8a9690]">{p.endsIn}</span>
            <div className="flex items-center gap-1.5">
              {p.memberCount && (
                <div className="flex items-center gap-0.5">
                  <Users size={12} className="text-[#8a9690]" />
                  <span className="text-[10px] text-[#8a9690]">
                    {p.memberCount}
                  </span>
                </div>
              )}
              {!p.memberCount && (
                <span className="rounded-full bg-[#0E1B19]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#0E1B19]">
                  {p.actionLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
