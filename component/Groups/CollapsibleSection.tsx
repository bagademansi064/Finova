"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  rightLabel?: string;
  badgeCount?: number;
  badgeText?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  rightLabel,
  badgeCount = 0,
  badgeText,
  defaultExpanded = true,
  children,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const toggleExpanded = () => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="mt-4 px-5 animate-fade-in-up">
      {/* Section Header — Tappable */}
      <button
        onClick={toggleExpanded}
        className="flex w-full items-center justify-between tap-highlight"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[17px] font-bold text-[#0E1B19]">{title}</h3>
          {/* Badge indicator when collapsed */}
          {!isExpanded && badgeCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-[#00695C] px-2 py-0.5 text-[10px] font-bold text-white animate-fade-in-up">
              {badgeText || `${badgeCount} new`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {rightLabel && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a9690]">
              {rightLabel}
            </span>
          )}
          <ChevronDown
            size={18}
            className={`text-[#8a9690] transition-transform duration-300 ${
              isExpanded ? "rotate-0" : "-rotate-90"
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : "0px",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="pt-3">{children}</div>
      </div>
    </div>
  );
}
