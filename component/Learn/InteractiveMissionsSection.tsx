"use client";
import React from "react";
import { interactiveMissions, InteractiveMission } from "@/lib/learnData";
import { Search, Newspaper, FileText } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search size={20} className="text-[#00695C]" />,
  Newspaper: <Newspaper size={20} className="text-[#00695C]" />,
  FileText: <FileText size={20} className="text-[#00695C]" />,
};

function MissionCard({ mission }: { mission: InteractiveMission }) {
  return (
    <div className="flex items-center gap-4 bg-[#f5f7f6] rounded-2xl p-4 mb-3 transition-transform active:scale-95 cursor-pointer tap-highlight">
      {/* Icon Area */}
      <div className="flex bg-white h-[45px] w-[45px] rounded-2xl items-center justify-center flex-shrink-0 shadow-sm border border-gray-50">
        {iconMap[mission.icon] || <Search size={20} className="text-[#00695C]" />}
      </div>
      
      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-bold text-[#00695C] mb-1 truncate">
          {mission.title}
        </h4>
        <p className="text-gray-500 text-[12px] leading-snug line-clamp-2">
          {mission.description}
        </p>
      </div>
    </div>
  );
}

export default function InteractiveMissionsSection() {
  return (
    <div className="px-5 pb-24"> {/* Added pb-24 to account for bottom navigation bar */}
      <h3 className="text-[20px] font-bold text-[#00695C] mb-4">
        Interactive Missions
      </h3>
      <div className="flex flex-col">
        {interactiveMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
}
