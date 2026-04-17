"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

export default function ClubsSearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div
      className="mx-5 mt-3 animate-fade-in-up"
      style={{ animationDelay: "50ms" }}
    >
      <div className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-sm border border-[#e5e8e6] transition-shadow focus-within:shadow-md focus-within:border-[#00695C]/40">
        <Search size={18} className="text-[#9ca8a2] flex-shrink-0" />
        <input
          id="clubs-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clubs, members, or proposals..."
          className="w-full bg-transparent text-sm text-[#0E1B19] outline-none placeholder:text-[#a3b0aa]"
        />
      </div>
    </div>
  );
}
