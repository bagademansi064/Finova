"use client";
import React from "react";
import { Leaf, Trophy, Building2, TreePine } from "lucide-react";

interface GardenClub {
  name: string;
  returnPercent: string;
  icon: React.ReactNode;
  iconBg: string;
}

const gardenClubs: GardenClub[] = [
  {
    name: "Eco Alpha",
    returnPercent: "+13.4%",
    icon: <Leaf size={24} strokeWidth={1.6} className="text-[#00695C]" />,
    iconBg: "#e0f2f1",
  },
  {
    name: "Tech Bulls",
    returnPercent: "+8.1%",
    icon: <Trophy size={24} strokeWidth={1.6} className="text-[#00695C]" />,
    iconBg: "#e0f2f1",
  },
  {
    name: "Uptown REIT",
    returnPercent: "+4.2%",
    icon: <Building2 size={24} strokeWidth={1.6} className="text-[#5d7a72]" />,
    iconBg: "#eef3f0",
  },
  {
    name: "Global Div",
    returnPercent: "+15.8%",
    icon: <TreePine size={24} strokeWidth={1.6} className="text-[#00695C]" />,
    iconBg: "#e0f2f1",
  },
];

export default function TheGarden() {
  return (
    <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-1">
      {gardenClubs.map((club) => (
        <button
          key={club.name}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 tap-highlight transition-transform active:scale-95"
        >
          {/* Circle Icon */}
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full shadow-sm"
            style={{ backgroundColor: club.iconBg }}
          >
            {club.icon}
          </div>
          {/* Club Name */}
          <span className="text-[11px] font-semibold text-[#0E1B19] whitespace-nowrap">
            {club.name}
          </span>
          {/* Return % */}
          <span className="text-[11px] font-bold text-[#00695C]">
            {club.returnPercent}
          </span>
        </button>
      ))}
    </div>
  );
}
