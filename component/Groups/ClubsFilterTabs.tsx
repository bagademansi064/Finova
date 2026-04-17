"use client";
import React, { useState } from "react";

interface FilterTab {
  label: string;
  hasNotification?: boolean;
}

const tabs: FilterTab[] = [
  { label: "All" },
  { label: "Unread", hasNotification: true },
  { label: "Favorites" },
  { label: "My Clubs" },
];

export default function ClubsFilterTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      className="flex items-center gap-2 px-5 mt-4 overflow-x-auto hide-scrollbar animate-fade-in-up"
      style={{ animationDelay: "100ms" }}
    >
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          id={`clubs-filter-${tab.label.toLowerCase().replace(" ", "-")}`}
          onClick={() => setActiveTab(i)}
          className={`relative flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition-all tap-highlight ${
            activeTab === i
              ? "bg-[#0E1B19] text-white shadow-sm"
              : "bg-transparent text-[#6b7c75] hover:bg-[#eef2f0]"
          }`}
        >
          {tab.label}
          {/* Notification dot for Unread */}
          {tab.hasNotification && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#00695C]" />
          )}
        </button>
      ))}
    </div>
  );
}
