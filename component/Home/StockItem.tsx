"use client";
import React from "react";

interface StockItemProps {
  name: string;
  exchange: string;
  badge?: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export default function StockItem({
  name,
  exchange,
  badge,
  price,
  change,
  changePercent,
  isPositive,
}: StockItemProps) {
  return (
    <div className="flex items-center justify-between py-2.5 animate-fade-in-up">
      {/* Left side */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-[#0E1B19]">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#8a9690]">{exchange}</span>
          {badge && (
            <span className="rounded-sm bg-[#e8f5e9] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#00695C]">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-0.5">
        <span
          className={`text-[15px] font-semibold ${
            isPositive ? "text-[#00897B]" : "text-[#e53935]"
          }`}
        >
          {price}
        </span>
        <span
          className={`text-[11px] font-medium ${
            isPositive ? "text-[#00897B]" : "text-[#e53935]"
          }`}
        >
          {isPositive ? "+" : ""}
          {change} ({changePercent})
        </span>
      </div>
    </div>
  );
}
