"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

interface NewsItem {
  id: number;
  category: string;
  categoryColor: string;
  categoryBg: string;
  timeAgo: string;
  readTime: string;
  title: string;
  description: string;
  relatedTags?: string[];
}

const newsData: NewsItem[] = [
  {
    id: 1,
    category: "MARKET ALERT",
    categoryColor: "#c62828",
    categoryBg: "#ffebee",
    timeAgo: "2h ago",
    readTime: "5m read",
    title: "Solar Grid Club Reaches ₹15Cr Milestone in Community Funding",
    description:
      "The community-led initiative has successfully raised significant capital to expand solar infrastructure across residential blocks in Bangalore.",
    relatedTags: ["RELIANCE", "ADANIGREEN"],
  },
  {
    id: 2,
    category: "FINTECH",
    categoryColor: "#00695C",
    categoryBg: "#e0f2f1",
    timeAgo: "4h ago",
    readTime: "3m read",
    title: "RBI Announces New Digital Lending Guidelines for 2026",
    description:
      "The Reserve Bank of India has released comprehensive guidelines for digital lending platforms, impacting major fintech players.",
    relatedTags: ["BAJFINANCE", "PAYTM"],
  },
];

export default function LatestNews() {
  return (
    <div
      className="mt-4 px-5 pb-4 animate-fade-in-up"
      style={{ animationDelay: "300ms" }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[17px] font-bold text-[#0E1B19]">
          Latest News
          <span className="inline-block h-2 w-2 rounded-full bg-[#00695C]" />
        </h3>
        <button
          id="see-all-news"
          className="flex items-center gap-0.5 text-[13px] font-semibold text-[#00695C] transition-colors hover:text-[#004D40] tap-highlight"
        >
          SEE ALL
          <ChevronRight size={14} />
        </button>
      </div>

      {/* News Cards */}
      <div className="mt-4 space-y-4 stagger-children">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md animate-fade-in-up cursor-pointer"
          >
            {/* Category + Time */}
            <div className="flex items-center justify-between">
              <span
                className="rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: news.categoryColor,
                  backgroundColor: news.categoryBg,
                }}
              >
                {news.category}
              </span>
              <span className="text-[11px] text-[#8a9690]">
                {news.timeAgo} • {news.readTime}
              </span>
            </div>

            {/* Title */}
            <h4 className="mt-3 text-[15px] font-semibold leading-snug text-[#0E1B19]">
              {news.title}
            </h4>

            {/* Description */}
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#6b7c75]">
              {news.description}
            </p>

            {/* Related Tags */}
            {news.relatedTags && news.relatedTags.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase text-[#8a9690]">
                  Related:
                </span>
                {news.relatedTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#d6ddd9] bg-[#f7f9f8] px-2.5 py-0.5 text-[10px] font-semibold text-[#3d4f47]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
