"use client";
import React from "react";
import { learningPaths, LearningPath } from "@/lib/learnData";
import { TrendingUp, BarChart2, Users } from "lucide-react";

// Mapping string icon names from our mock data to actual Lucide components
const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp size={22} className="text-[#00695C]" />,
  BarChart2: <BarChart2 size={22} className="text-[#00695C]" />,
  Users: <Users size={22} className="text-[#00695C]" />,
};

function PathCard({ path }: { path: LearningPath }) {
  return (
    <div className="flex-shrink-0 w-[240px] bg-white rounded-3xl p-5 shadow-sm border border-gray-100 snap-center tap-highlight cursor-pointer transition-transform active:scale-95">
      {/* Icon & Badge */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex bg-[#00695C]/10 h-12 w-12 rounded-full items-center justify-center">
          {iconMap[path.icon] || <TrendingUp size={22} className="text-[#00695C]" />}
        </div>
        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
          {path.difficulty}
        </span>
      </div>

      {/* Title & Desc */}
      <h4 className="text-[17px] font-bold text-[#0E1B19] mb-2 leading-tight">
        {path.title}
      </h4>
      <p className="text-gray-500 text-[13px] leading-relaxed mb-6 h-10 line-clamp-2">
        {path.description}
      </p>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#00695C] rounded-full" 
            style={{ width: `${path.progress}%` }} 
          />
        </div>
        <span className="text-[11px] font-bold text-[#0E1B19]">
          {path.progress}%
        </span>
      </div>
    </div>
  );
}

export default function LearningPathsSection() {
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <h3 className="text-[20px] font-bold text-[#00695C]">Learning Paths</h3>
        <button className="text-[13px] font-bold text-[#00695C] hover:text-[#004d40] transition-colors tap-highlight">
          View All
        </button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto gap-4 px-5 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {learningPaths.map((path) => (
          <PathCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
}
