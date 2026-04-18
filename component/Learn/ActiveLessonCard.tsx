"use client";
import React from "react";
import { PlayCircle, ArrowRight } from "lucide-react";

interface ActiveLessonCardProps {
  title?: string;
  description?: string;
  progress?: number;
  duration?: string;
  onResume?: () => void;
}

export default function ActiveLessonCard({
  title = "Lesson 4: Reading Candlesticks",
  description = "Master the language of the market to make informed decisions.",
  progress = 65,
  duration = "30 min module",
  onResume,
}: ActiveLessonCardProps) {
  return (
    <div className="mx-5 mb-8 rounded-3xl bg-gradient-to-br from-[#1E5D4B] to-[#144234] p-5 shadow-lg shadow-[#00695C]/20">
      {/* Top row: Badge and Duration */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 bg-[#a3e6d1]/20 px-3 py-1.5 rounded-full">
          <PlayCircle size={14} className="text-[#a3e6d1]" />
          <span className="text-[11px] font-bold tracking-widest text-[#a3e6d1] uppercase mt-0.5">
            Next Up
          </span>
        </div>
        <span className="text-[#a3e6d1]/70 text-xs font-medium">
          {duration}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-white text-[22px] font-bold mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-[#a3e6d1]/80 text-[14px] leading-relaxed mb-6 max-w-[90%]">
        {description}
      </p>

      {/* Bottom row: Button and Progress */}
      <div className="flex items-end justify-between">
        <button
          onClick={onResume}
          className="flex items-center gap-2 bg-[#A3E6D1] text-[#0E1B19] px-5 py-3 rounded-full font-bold text-sm transition-transform active:scale-95 shadow-sm tap-highlight"
        >
          Resume Lesson
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>

        <div className="w-[100px] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-white text-[11px] font-medium">
            <span className="text-[#a3e6d1]/70">Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A3E6D1] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
