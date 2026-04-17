"use client";
import React from "react";

const weeklyData = [
  { label: "Mon", value: 40 },
  { label: "Tue", value: 55 },
  { label: "Wed", value: 50 },
  { label: "Thu", value: 45 },
  { label: "Fri", value: 60 },
  { label: "Sat", value: 52 },
  { label: "Today", value: 85 },
];

export default function PortfolioCard() {
  const maxValue = Math.max(...weeklyData.map((d) => d.value));

  return (
    <div className="mx-5 mt-3 rounded-2xl bg-[#1A3C34] p-4 pb-3 shadow-lg animate-fade-in-up">
      {/* Label */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#8ec5a8]">
        Portfolio Total Worth
      </p>

      {/* Amount */}
      <h2 className="mt-1 text-[26px] font-bold leading-tight text-white">
        ₹ 50,000.17
      </h2>

      {/* Bar Chart */}
      <div className="mt-3 flex items-end justify-between gap-2" style={{ height: 56 }}>
        {weeklyData.map((bar, i) => {
          const heightPercent = (bar.value / maxValue) * 100;
          const isToday = i === weeklyData.length - 1;
          return (
            <div
              key={bar.label}
              className="flex-1 rounded-md animate-grow-bar"
              style={{
                height: `${heightPercent}%`,
                backgroundColor: isToday ? "#8ec5a8" : "#2d5a4e",
                animationDelay: `${i * 80 + 200}ms`,
              }}
            />
          );
        })}
      </div>

      {/* Range Labels */}
      <div className="mt-2 flex justify-between">
        <span className="text-[10px] font-medium text-[#6b9e86]">1 Month Ago</span>
        <span className="text-[10px] font-medium text-[#8ec5a8]">Today</span>
      </div>
    </div>
  );
}
