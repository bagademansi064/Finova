"use client";
import React from "react";
import { Menu } from "lucide-react";

interface LearnHeaderProps {
  userName?: string;
}

export default function LearnHeader({ userName = "Alex" }: LearnHeaderProps) {
  return (
    <div className="px-5 pt-8 pb-4">
      {/* Top Nav Bar */}
      <div className="relative flex items-center justify-between mb-8">
        <button 
          className="p-2 -ml-2 rounded-full hover:bg-[#00695c]/10 transition-colors tap-highlight"
          aria-label="Menu"
        >
          <Menu size={24} className="text-[#00695C]" />
        </button>
        <h1 className="text-xl font-bold text-[#00695C] absolute left-1/2 -translate-x-1/2">
          Learn
        </h1>
        {/* Invisible placeholder to balance the flex space if needed, though absolute handles centering */}
        <div className="w-10"></div>
      </div>

      {/* Greeting Section */}
      <div>
        <h2 className="text-[32px] font-bold text-[#00695C] mb-3 tracking-tight leading-tight">
          Welcome back, {userName}.
        </h2>
        <p className="text-gray-600 text-[15px] leading-relaxed pr-4">
          Your financial garden is ready to grow. Let's pick up where you left off.
        </p>
      </div>
    </div>
  );
}
