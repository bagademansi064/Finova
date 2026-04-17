"use client";
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="mx-5 mt-3 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
      {/* Search Input */}
      <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-[#d6ddd9] bg-white px-4 py-2.5 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-[#00695C]/40">
        <Search size={18} className="text-[#9ca8a2] flex-shrink-0" />
        <input
          id="search-instruments"
          type="text"
          placeholder="Search instruments..."
          className="w-full bg-transparent text-sm text-[#0E1B19] outline-none placeholder:text-[#a3b0aa]"
        />
      </div>

      {/* Filter Button */}
      <button
        id="filter-button"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#d6ddd9] bg-white shadow-sm transition-colors hover:bg-[#f0f5f2] active:bg-[#e0ebe5] tap-highlight"
        aria-label="Filter"
      >
        <SlidersHorizontal size={18} className="text-[#0E1B19]" />
      </button>
    </div>
  );
}
