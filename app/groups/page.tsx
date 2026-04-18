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
import InvitationsList from "@/component/Groups/InvitationsList";

// Keep mock messages for UI spacing until websocket is fully bound universally.
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

import { apiFetch } from "@/lib/api";

export default function GroupsPage() {
  const [clubs, setClubs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await apiFetch("/groups/");
        if (response.ok) {
          const data = await response.json();
          const clubList = Array.isArray(data) ? data : (data.results || []);
          setClubs(clubList);
        }
      } catch (e) {
        console.error("Failed to load groups", e);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

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
        {hasClubs && (
          <CollapsibleSection
            title="The Garden"
            rightLabel="Top Performers"
            badgeCount={1}
            badgeText="1 new"
            defaultExpanded={true}
          >
            <TheGarden />
          </CollapsibleSection>
        )}

        {/* Active Proposals — Collapsible */}
        {hasClubs && (
          <CollapsibleSection
            title="Active Proposals"
            rightLabel="Needs Vote"
            badgeCount={2}
            badgeText="2 pending"
            defaultExpanded={true}
          >
            <ActiveProposals />
          </CollapsibleSection>
        )}

        {/* Pending Invitations */}
        <InvitationsList />

        {/* Your Clubs Section */}
        <div className="mt-5 px-5">
          <h3 className="text-[17px] font-bold text-[#0E1B19] animate-fade-in-up">
            Your Clubs
          </h3>
        </div>

        {hasClubs ? (
          <div className="mt-3 px-5 space-y-3 stagger-children">
            {clubs.map((club) => (
              <ClubCard
                key={club.id}
                id={club.id}
                finova_id={club.finova_id}
                name={club.name}
                initials={club.name.substring(0, 2).toUpperCase()}
                avatarBg="#e0f2f1"
                avatarTextColor="#00695C"
                description={club.description || "Active investment group"}
                members={club.member_count}
                aum="₹"
                returnPercent="0.0%"
                isPositive={true}
              />
            ))}
          </div>
        ) : (
          !loading && <EmptyState />
        )}

        {/* Recent Messages Section */}
        {hasClubs && (
          <>
            <div className="mt-6 px-5">
              <h3 className="text-[17px] font-bold text-[#0E1B19] animate-fade-in-up">
                Recent Chats
              </h3>
            </div>
            <div className="mt-3 px-5 space-y-3 stagger-children">
              {clubs.slice(0, messages.length).map((club, idx) => (
                <ClubMessage 
                  key={`msg-${club.id}`} 
                  {...messages[idx]} 
                  href={`/groups/chat?groupId=${club.id}&finovaId=${club.finova_id}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* FAB */}
      <CreateClubFAB />

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
