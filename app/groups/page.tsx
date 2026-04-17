"use client";
import React from "react";
import BottomNavBar from "@/component/Home/BottomNavBar";
import ClubsHeader from "@/component/Groups/ClubsHeader";
import ClubsSearchBar from "@/component/Groups/ClubsSearchBar";
import ClubsFilterTabs from "@/component/Groups/ClubsFilterTabs";
import CollapsibleSection from "@/component/Groups/CollapsibleSection";
import TheGarden from "@/component/Groups/TheGarden";
import ActiveProposals from "@/component/Groups/ActiveProposals";
import ClubCard from "@/component/Groups/ClubCard";
import ClubMessage from "@/component/Groups/ClubMessage";
import EmptyState from "@/component/Groups/EmptyState";
import CreateClubFAB from "@/component/Groups/CreateClubFAB";

/* ── Mock Data ──────────────────────────────────────────────── */

const clubs = [
  {
    name: "Tech Bulls Syndicate",
    initials: "TB",
    avatarBg: "#e0f2f1",
    avatarTextColor: "#00695C",
    description: "Should we rotate out of legacy semi-conductors?",
    members: 24,
    aum: "$42.5k",
    returnPercent: "8.1%",
    isPositive: true,
  },
  {
    name: "Eco Alpha Core",
    initials: "EA",
    avatarBg: "#e8f5e9",
    avatarTextColor: "#2e7d32",
    description: "Monthly dividend distribution confirmed.",
    members: 12,
    aum: "$19.2k",
    returnPercent: "12.4%",
    isPositive: true,
  },
];

const messages = [
  {
    name: "Pranav M.",
    message: "To kick anybody out we vote",
    avatarInitials: "PM",
    avatarBg: "#e0f2f1",
    avatarTextColor: "#00695C",
  },
  {
    name: "Sarah Jenkins",
    message: "Thanks for sharing the REIT analysis.",
    avatarInitials: "SJ",
    avatarBg: "#fff3e0",
    avatarTextColor: "#e65100",
  },
];

/* ── Page ────────────────────────────────────────────────────── */

export default function GroupsPage() {
  // In a real app these would come from a backend
  const hasClubs = clubs.length > 0;

  return (
    <div className="min-h-screen bg-[#f5f7f6]">
      {/* Scrollable Content */}
      <div
        className="overflow-y-auto hide-scrollbar"
        style={{ paddingBottom: "calc(var(--bottom-nav-height) + 24px)" }}
      >
        {/* Header */}
        <ClubsHeader />

        {/* Search */}
        <ClubsSearchBar />

        {/* Filter Tabs */}
        <ClubsFilterTabs />

        {/* The Garden — Collapsible */}
        <CollapsibleSection
          title="The Garden"
          rightLabel="Top Performers"
          badgeCount={1}
          badgeText="1 new"
          defaultExpanded={true}
        >
          <TheGarden />
        </CollapsibleSection>

        {/* Active Proposals — Collapsible */}
        <CollapsibleSection
          title="Active Proposals"
          rightLabel="Needs Vote"
          badgeCount={2}
          badgeText="2 pending"
          defaultExpanded={true}
        >
          <ActiveProposals />
        </CollapsibleSection>

        {/* Your Clubs Section */}
        <div className="mt-5 px-5">
          <h3 className="text-[17px] font-bold text-[#0E1B19] animate-fade-in-up">
            Your Clubs
          </h3>
        </div>

        {hasClubs ? (
          <div className="mt-3 px-5 space-y-3 stagger-children">
            {/* Club 1 */}
            <ClubCard {...clubs[0]} />

            {/* Message from Pranav */}
            <ClubMessage {...messages[0]} />

            {/* Club 2 */}
            <ClubCard {...clubs[1]} />

            {/* Message from Sarah */}
            <ClubMessage {...messages[1]} />
          </div>
        ) : (
          /* Empty state — shown when no clubs or contacts */
          <EmptyState />
        )}
      </div>

      {/* FAB */}
      <CreateClubFAB />

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
