"use client";
import React from "react";
import HomeHeader from "@/component/Home/HomeHeader";
import PortfolioCard from "@/component/Home/PortfolioCard";
import SearchBar from "@/component/Home/SearchBar";
import StockWatchlist from "@/component/Home/StockWatchlist";
import LatestNews from "@/component/Home/LatestNews";
import BottomNavBar from "@/component/Home/BottomNavBar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f7f6]">
      {/* Scrollable Content Area */}
      <div
        className="overflow-y-auto hide-scrollbar"
        style={{ paddingBottom: "calc(var(--bottom-nav-height) + 16px)" }}
      >
        {/* Header */}
        <HomeHeader />

        {/* Portfolio Card */}
        <PortfolioCard />

        {/* Search Bar */}
        <SearchBar />

        {/* Stock Watchlist */}
        <StockWatchlist />

        {/* Latest News */}
        <LatestNews />
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
