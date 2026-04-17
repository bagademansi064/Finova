"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  BookOpen,
  Briefcase,
  Users,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  {
    id: "nav-stocks",
    label: "Stocks",
    icon: <TrendingUp size={22} strokeWidth={1.8} />,
    href: "/stocks",
  },
  {
    id: "nav-learn",
    label: "Learn",
    icon: <BookOpen size={22} strokeWidth={1.8} />,
    href: "/learn",
  },
  {
    id: "nav-portfolio",
    label: "Portfolio",
    icon: <Briefcase size={22} strokeWidth={1.8} />,
    href: "/home",
    isCenter: true,
  },
  {
    id: "nav-groups",
    label: "Groups",
    icon: <Users size={22} strokeWidth={1.8} />,
    href: "/groups",
  },
  {
    id: "nav-account",
    label: "Account",
    icon: <UserCircle size={22} strokeWidth={1.8} />,
    href: "/account",
  },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around border-t border-[#e5e8e6] bg-white/95 backdrop-blur-lg px-2 pb-2 pt-1.5"
      style={{ height: "var(--bottom-nav-height)" }}
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/home" && pathname === "/home");

        if (item.isCenter) {
          return (
            <Link
              key={item.id}
              id={item.id}
              href={item.href}
              className="flex flex-col items-center gap-0.5 tap-highlight -mt-5"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 ${
                  isActive
                    ? "bg-[#0D624B] text-white"
                    : "bg-[#0D624B] text-white"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  isActive ? "text-[#0D624B]" : "text-[#8a9690]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.id}
            id={item.id}
            href={item.href}
            className="flex flex-col items-center gap-1 py-1.5 tap-highlight"
          >
            <div
              className={`transition-colors ${
                isActive ? "text-[#0D624B]" : "text-[#8a9690]"
              }`}
            >
              {item.icon}
            </div>
            <span
              className={`text-[10px] font-medium uppercase tracking-wide ${
                isActive ? "text-[#0D624B] font-semibold" : "text-[#8a9690]"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
