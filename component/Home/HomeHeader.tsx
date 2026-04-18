"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { apiFetch } from "@/lib/api";
import NotificationDropdown from "./NotificationDropdown";

export default function HomeHeader() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvitations();
    
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await apiFetch("/groups/invitations/");
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.results || data);
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  const handleRespond = async (id: string, action: "accept" | "reject") => {
    try {
      const response = await apiFetch(`/groups/invitations/${id}/respond/`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
        if (action === "accept") {
          // If accepted, maybe we want to go to groups? 
          // For now just refresh or trust the user sees the new group in groups tab.
        }
      }
    } catch (e) {
      console.error("Failed to respond to invitation", e);
    }
  };

  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 relative" ref={dropdownRef}>
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <img
          src="/finovaLogo.png"
          alt="Finova Logo"
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className="text-xl font-bold tracking-tight text-[#0E1B19]">
          <span className="text-[#00695C]">F</span>inova
        </span>
      </div>

      {/* Notification Bell */}
      <div className="relative">
        <button
          id="notification-bell"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#e8f5e9] active:bg-[#c8e6c9] tap-highlight"
          aria-label="Notifications"
        >
          <Bell size={22} strokeWidth={1.8} className="text-[#0E1B19]" />
          
          {invitations.length > 0 && (
            <>
              {/* Pulsing indicator */}
              <span className="absolute right-2.5 top-2.5 h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#e53935]" />
            </>
          )}
        </button>

        {isOpen && (
          <NotificationDropdown 
            invitations={invitations} 
            onRespond={handleRespond} 
            onClose={() => setIsOpen(false)} 
          />
        )}
      </div>
    </div>
  );
}
