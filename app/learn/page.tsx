"use client";
import React from "react";
import LearnHeader from "@/component/Learn/LearnHeader";
import ActiveLessonCard from "@/component/Learn/ActiveLessonCard";
import LearningPathsSection from "@/component/Learn/LearningPathsSection";
import InteractiveMissionsSection from "@/component/Learn/InteractiveMissionsSection";
import BottomNavBar from "@/component/Home/BottomNavBar";

export default function LearnPage() {
  const handleResumeLesson = () => {
    console.log("Resume lesson clicked");
    // Add routing or modal logic here
  };

  return (
    <div className="min-h-screen bg-[#f5f7f6] flex flex-col">
      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto hide-scrollbar relative"
        style={{ paddingBottom: "calc(var(--bottom-nav-height, 80px) + 24px)" }}
      >
        <LearnHeader userName="Alex" />

        <ActiveLessonCard 
          onResume={handleResumeLesson}
        />

        <LearningPathsSection />

        <InteractiveMissionsSection />
      </div>

      {/* Persistent Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
